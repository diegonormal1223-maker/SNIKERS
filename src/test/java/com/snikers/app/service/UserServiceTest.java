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
}