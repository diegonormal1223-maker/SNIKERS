package com.snikers.app.service;

import com.snikers.app.model.User;
import com.snikers.app.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {

        user = User.builder()
                .name("Juan Perez")
                .email("juan@gmail.com")
                .password("123456")
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build();
    }

    @Test
    void shouldRegisterUserSuccessfully() {

        when(userRepository.findByEmail("juan@gmail.com"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("123456"))
                .thenReturn("encryptedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        User result = userService.registerUser(user);

        assertNotNull(result);

        verify(userRepository, times(1))
                .findByEmail("juan@gmail.com");

        verify(passwordEncoder, times(1))
                .encode("123456");

        verify(userRepository, times(1))
                .save(any(User.class));
    }

    // TEST 2: Email ya registrado
@Test
void shouldThrowExceptionWhenEmailAlreadyExists() {

    when(userRepository.findByEmail("juan@gmail.com"))
            .thenReturn(Optional.of(user));

    RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.registerUser(user)
    );

    assertEquals("Email already exists", exception.getMessage());

    verify(userRepository, never()).save(any(User.class));
}

// TEST 3: Email inválido
@Test
void shouldThrowExceptionWhenEmailIsInvalid() {

    user.setEmail("correo_invalido");

    assertThrows(
            IllegalArgumentException.class,
            () -> userService.registerUser(user)
    );

    verify(userRepository, never()).save(any(User.class));
}

// TEST 4: Buscar usuario por ID
@Test
void shouldFindUserById() {

    when(userRepository.findById(1L))
            .thenReturn(Optional.of(user));

    Optional<User> result = userService.getUserById(1L);

    assertTrue(result.isPresent());
    assertEquals("Juan Perez", result.get().getName());

    verify(userRepository).findById(1L);
}

// TEST 5: Usuario no encontrado por ID
@Test
void shouldReturnEmptyWhenUserNotFound() {

    when(userRepository.findById(99L))
            .thenReturn(Optional.empty());

    Optional<User> result = userService.getUserById(99L);

    assertFalse(result.isPresent());

    verify(userRepository).findById(99L);
}

// TEST 6: Actualizar estado del usuario
@Test
void shouldUpdateUserStatus() {

    when(userRepository.findById(1L))
            .thenReturn(Optional.of(user));

    when(userRepository.save(any(User.class)))
            .thenReturn(user);

    User result = userService.updateUserStatus(
            1L,
            User.Status.INACTIVE
    );

    assertNotNull(result);
    assertEquals(User.Status.INACTIVE, user.getStatus());

    verify(userRepository).save(user);
}

// TEST 7: Actualizar estado usuario inexistente
@Test
void shouldThrowExceptionWhenUpdatingStatusOfNonExistingUser() {

    when(userRepository.findById(99L))
            .thenReturn(Optional.empty());

    assertThrows(
            RuntimeException.class,
            () -> userService.updateUserStatus(
                    99L,
                    User.Status.INACTIVE
            )
    );
}

// TEST 8: Actualizar perfil correctamente
@Test
void shouldUpdateUserProfileSuccessfully() {

    when(userRepository.findById(1L))
            .thenReturn(Optional.of(user));

    when(userRepository.save(any(User.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

    User result = userService.updateUserProfile(
            1L,
            "Juan Carlos",
            "3001234567"
    );

    assertEquals("Juan Carlos", result.getName());
    assertEquals("3001234567", result.getPhone());
}

// TEST 9: Nombre inválido
@Test
void shouldThrowExceptionWhenNameContainsNumbers() {

    when(userRepository.findById(1L))
            .thenReturn(Optional.of(user));

    assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateUserProfile(
                    1L,
                    "Juan123",
                    "3001234567"
            )
    );
}

// TEST 10: Teléfono inválido
@Test
void shouldThrowExceptionWhenPhoneIsInvalid() {

    when(userRepository.findById(1L))
            .thenReturn(Optional.of(user));

    assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateUserProfile(
                    1L,
                    "Juan Perez",
                    "12345"
            )
    );
}

// TEST 11: Buscar usuario por email
@Test
void shouldFindUserByEmail() {

    when(userRepository.findByEmail("juan@gmail.com"))
            .thenReturn(Optional.of(user));

    User result = userService.findByEmail("juan@gmail.com");

    assertNotNull(result);
    assertEquals("juan@gmail.com", result.getEmail());
}

// TEST 12: Contar usuarios por rol
@Test
void shouldCountUsersByRole() {

    when(userRepository.countByRole(User.Role.USER))
            .thenReturn(5L);

    long count = userService.countUsersByRole(User.Role.USER);

    assertEquals(5L, count);

    verify(userRepository).countByRole(User.Role.USER);
}
}