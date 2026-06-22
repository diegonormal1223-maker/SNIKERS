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

    @Test
void shouldFindUserById() {

    User user = User.builder()
            .name("Maria Lopez")
            .email("maria@gmail.com")
            .password("123456")
            .role(User.Role.USER)
            .status(User.Status.ACTIVE)
            .build();

    User saved = userService.registerUser(user);

    var result = userService.getUserById(saved.getId());

    assertTrue(result.isPresent());
    assertEquals("Maria Lopez", result.get().getName());
}

@Test
void shouldReturnEmptyWhenUserDoesNotExist() {

    var result = userService.getUserById(99999L);

    assertFalse(result.isPresent());
}

@Test
void shouldUpdateUserStatus() {

    User user = User.builder()
            .name("Andres")
            .email("andres@gmail.com")
            .password("123456")
            .role(User.Role.USER)
            .status(User.Status.ACTIVE)
            .build();

    User saved = userService.registerUser(user);

    User updated = userService.updateUserStatus(
            saved.getId(),
            User.Status.INACTIVE);

    assertEquals(
            User.Status.INACTIVE,
            updated.getStatus());
}

@Test
void shouldThrowExceptionWhenUpdatingStatusOfNonExistingUser() {

    RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.updateUserStatus(
                    99999L,
                    User.Status.INACTIVE));

    assertEquals(
            "User not found",
            exception.getMessage());
}

@Test
void shouldUpdateUserProfile() {

    User user = User.builder()
            .name("Pedro Gomez")
            .email("pedro@gmail.com")
            .password("123456")
            .role(User.Role.USER)
            .status(User.Status.ACTIVE)
            .build();

    User saved = userService.registerUser(user);

    User updated = userService.updateUserProfile(
            saved.getId(),
            "Pedro Ramirez",
            "3001234567");

    assertEquals(
            "Pedro Ramirez",
            updated.getName());

    assertEquals(
            "3001234567",
            updated.getPhone());
}

@Test
void shouldThrowExceptionWhenUpdatingProfileWithInvalidName() {

    User user = User.builder()
            .name("Camilo Perez")
            .email("camilo@gmail.com")
            .password("123456")
            .role(User.Role.USER)
            .status(User.Status.ACTIVE)
            .build();

    User saved = userService.registerUser(user);

    assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateUserProfile(
                    saved.getId(),
                    "Camilo123",
                    "3001234567"));
}

@Test
void shouldThrowExceptionWhenUpdatingProfileWithInvalidPhone() {

    User user = User.builder()
            .name("Laura Torres")
            .email("laura@gmail.com")
            .password("123456")
            .role(User.Role.USER)
            .status(User.Status.ACTIVE)
            .build();

    User saved = userService.registerUser(user);

    assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateUserProfile(
                    saved.getId(),
                    "Laura Torres",
                    "12345"));
}

@Test
void shouldCountUsersByRole() {

    User user1 = User.builder()
            .name("User One")
            .email("userone@gmail.com")
            .password("123456")
            .role(User.Role.USER)
            .status(User.Status.ACTIVE)
            .build();

    User user2 = User.builder()
            .name("User Two")
            .email("usertwo@gmail.com")
            .password("123456")
            .role(User.Role.USER)
            .status(User.Status.ACTIVE)
            .build();

    userService.registerUser(user1);
    userService.registerUser(user2);

    long count = userService.countUsersByRole(User.Role.USER);

    assertTrue(count >= 2);
}

@Test
void shouldReturnAllUsers() {

    User user = User.builder()
            .name("Test User")
            .email("testuser@gmail.com")
            .password("123456")
            .role(User.Role.USER)
            .status(User.Status.ACTIVE)
            .build();

    userService.registerUser(user);

    var users = userService.getAllUsers();

    assertFalse(users.isEmpty());
}
}