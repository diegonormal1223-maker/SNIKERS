package com.snikers.app.service;

import com.snikers.app.model.User;
import com.snikers.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jakarta.persistence.criteria.Predicate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public User registerUser(User user) {
        // Validar email estricto
        if (user.getEmail() != null && !isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException(
                    "Email inválido. Debe tener al menos 2 caracteres antes de @ y un dominio válido.");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Método con paginación y filtros
    public Page<User> getAllUsers(Pageable pageable, String search, String role, String status) {
        return userRepository.findAll((root, query, criteriaBuilder) -> {
            var predicates = new java.util.ArrayList<Predicate>();

            // Filtro por búsqueda (nombre o email)
            if (search != null && !search.isEmpty()) {
                Predicate namePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + search.toLowerCase() + "%");
                Predicate emailPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")),
                        "%" + search.toLowerCase() + "%");
                predicates.add(criteriaBuilder.or(namePredicate, emailPredicate));
            }

            // Filtro por rol
            if (role != null && !role.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("role"), User.Role.valueOf(role)));
            }

            // Filtro por estado
            if (status != null && !status.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("status"), User.Status.valueOf(status)));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        }, pageable);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public User updateUserStatus(Long id, User.Status status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        return userRepository.save(user);
    }

    public User updateUserProfile(Long userId, String name, String phone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (name != null && !name.isEmpty()) {
            if (!name.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
                throw new IllegalArgumentException("El nombre no debe contener números ni símbolos.");
            }
            user.setName(name);
        }

        if (phone != null && !phone.isEmpty()) {
            if (!phone.matches("^(?:\\+57)?3\\d{9}$")) {
                throw new IllegalArgumentException("El teléfono debe ser un número válido de Colombia.");
            }
            user.setPhone(phone);
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, User userData) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validar y actualizar email si se proporciona
        if (userData.getEmail() != null && !userData.getEmail().isEmpty()) {
            String email = userData.getEmail().trim();

            // Validación estricta de email
            if (!isValidEmail(email)) {
                throw new IllegalArgumentException(
                        "Email inválido. Debe tener al menos 2 caracteres antes de @ y un dominio válido.");
            }

            // Verificar que el email no esté en uso por otro usuario
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new IllegalArgumentException("El email ya está en uso por otro usuario.");
            }

            user.setEmail(email);
        }

        // Actualizar nombre si se proporciona
        if (userData.getName() != null && !userData.getName().isEmpty()) {
            String name = userData.getName().trim();
            if (!name.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
                throw new IllegalArgumentException("El nombre no debe contener números ni símbolos.");
            }
            if (!name.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$")) {
                throw new IllegalArgumentException("El nombre debe contener al menos nombre y apellido.");
            }
            user.setName(name);
        }

        // Actualizar teléfono si se proporciona
        if (userData.getPhone() != null && !userData.getPhone().isEmpty()) {
            String phone = userData.getPhone().trim();
            if (!phone.matches("^3\\d{9}$")) {
                throw new IllegalArgumentException(
                        "El teléfono debe ser un número válido de Colombia (10 dígitos, inicia con 3).");
            }
            user.setPhone(phone);
        }

        // Actualizar rol si se proporciona
        if (userData.getRole() != null) {
            user.setRole(userData.getRole());
        }

        // Actualizar estado si se proporciona
        if (userData.getStatus() != null) {
            user.setStatus(userData.getStatus());
        }

        // Actualizar contraseña solo si se proporciona (opcional en edición)
        if (userData.getPassword() != null && !userData.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userData.getPassword()));
        }

        return userRepository.save(user);
    }

    private boolean isValidEmail(String email) {
        // Patrón estricto: debe empezar con letra, mínimo 2 caracteres antes de @
        // Dominio debe tener mínimo 2 caracteres antes del TLD
        // TLD debe tener mínimo 2 caracteres
        String emailPattern = "^[A-Za-z][A-Za-z0-9._-]{1,}@[A-Za-z0-9.-]{2,}\\.[A-Za-z]{2,}$";
        if (!email.matches(emailPattern)) {
            return false;
        }

        // Validaciones adicionales
        String[] parts = email.split("@");
        if (parts.length != 2)
            return false;

        String username = parts[0];
        String domain = parts[1];

        // El nombre de usuario debe tener al menos 2 caracteres
        if (username.length() < 2)
            return false;

        // El dominio antes del TLD debe tener al menos 2 caracteres
        String[] domainParts = domain.split("\\.");
        if (domainParts.length < 2 || domainParts[0].length() < 2)
            return false;

        return true;
    }

    public long countUsersByRole(User.Role role) {
        return userRepository.countByRole(role);
    }
}
