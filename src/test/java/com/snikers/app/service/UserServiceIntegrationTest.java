package com.snikers.app.service;

import com.snikers.app.model.User;
import com.snikers.app.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UserServiceIntegrationTest {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Test
    void shouldRegisterUserAndSaveInDatabase() {

        User user = User.builder()
                .name("Juan Perez")
                .email("juan@gmail.com")
                .password("123456")
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build();

        User saved = userService.registerUser(user);

        assertNotNull(saved.getId());

        User dbUser = userRepository
                .findByEmail("juan@gmail.com")
                .orElse(null);

        assertNotNull(dbUser);

        assertEquals(
                "Juan Perez",
                dbUser.getName());
    }

    @Test
    void shouldThrowExceptionWhenEmailExists() {

        User user1 = User.builder()
                .name("Juan")
                .email("correo@gmail.com")
                .password("123456")
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build();

        userService.registerUser(user1);

        User user2 = User.builder()
                .name("Pedro")
                .email("correo@gmail.com")
                .password("654321")
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build();

        RuntimeException exception =
                assertThrows(RuntimeException.class,
                        () -> userService.registerUser(user2));

        assertEquals(
                "Email already exists",
                exception.getMessage());
    }

    // ✅ NUEVO TEST DE INTEGRACIÓN
    @Test
    void shouldFindUserByEmail() {

        User user = User.builder()
                .name("Carlos")
                .email("carlos@gmail.com")
                .password("123456")
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build();

        userService.registerUser(user);

        User found = userRepository
                .findByEmail("carlos@gmail.com")
                .orElse(null);

        assertNotNull(found);
        assertEquals("Carlos", found.getName());
        assertEquals("carlos@gmail.com", found.getEmail());
    }
}