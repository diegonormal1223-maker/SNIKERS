package com.snikers.app.config;

import com.snikers.app.model.User;
import com.snikers.app.model.Category;
import com.snikers.app.model.Product;
import com.snikers.app.repository.AddressRepository;
import com.snikers.app.repository.CartItemRepository;
import com.snikers.app.repository.CartRepository;
import com.snikers.app.repository.CategoryRepository;
import com.snikers.app.repository.FavoriteRepository;
import com.snikers.app.repository.OrderRepository;
import com.snikers.app.repository.ProductRepository;
import com.snikers.app.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@org.springframework.context.annotation.Profile("!test")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final FavoriteRepository favoriteRepository;
    private final AddressRepository addressRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("🚀 INICIANDO CARGA DE DATOS...");
        clearAllData();
        seedUsers();
        seedCategoriesAndProducts();
        System.out.println("✅ CARGA DE DATOS COMPLETADA.");
    }

    private void clearAllData() {
        System.out.println("🗑️  Limpiando datos anteriores...");

        // 1. Dependents of cart_items and carts
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();

        // 2. Dependents of order_items and orders
        orderRepository.deleteAll();

        // 3. Favorites (references users and products)
        favoriteRepository.deleteAll();

        // 4. Addresses (references users)
        addressRepository.deleteAll();

        // 5. Products (references categories)
        productRepository.deleteAll();

        // 6. Categories
        categoryRepository.deleteAll();

        // 7. Users
        userRepository.deleteAll();

        System.out.println("✅ Datos anteriores eliminados.");
    }

    private void seedUsers() {

        // ADMIN
        User admin = User.builder()
                .name("Admin User")
                .email("admin@snikers.com")
                .password(passwordEncoder.encode("Admin1234!"))
                .role(User.Role.ADMIN)
                .status(User.Status.ACTIVE)
                .build();

        userRepository.save(admin);

        System.out.println(">> ADMIN CREADO: admin@snikers.com / Admin1234!");

        // CLIENTE
        User client = User.builder()
                .name("Cliente User")
                .email("cliente@snikers.com")
                .password(passwordEncoder.encode("Cliente1234!"))
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build();

        userRepository.save(client);

        System.out.println(">> CLIENTE CREADO: cliente@snikers.com / Cliente1234!");
    }

    private void seedCategoriesAndProducts() {

        // Categorías
        Category running = Category.builder()
                .name("Running")
                .description("Para correr")
                .build();

        Category lifestyle = Category.builder()
                .name("Lifestyle")
                .description("Urbano")
                .build();

        Category basket = Category.builder()
                .name("Basquet")
                .description("Deporte")
                .build();

        categoryRepository.saveAll(Arrays.asList(running, lifestyle, basket));

        System.out.println(">> Categorías CREADAS");

        // Productos
        List<Product> products = Arrays.asList(

                Product.builder()
                        .name("Nike Air Max")
                        .price(new BigDecimal("120.00"))
                        .stock(50)
                        .category(running)
                        .brand("Nike")
                        .description("Comodidad total")
                        .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500")
                        .status(Product.Status.ACTIVE)
                        .build(),

                Product.builder()
                        .name("Adidas Ultraboost")
                        .price(new BigDecimal("180.00"))
                        .stock(40)
                        .category(running)
                        .brand("Adidas")
                        .description("Energía pura")
                        .imageUrl("https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500")
                        .status(Product.Status.ACTIVE)
                        .build(),

                Product.builder()
                        .name("Jordan Retro")
                        .price(new BigDecimal("220.00"))
                        .stock(10)
                        .category(basket)
                        .brand("Jordan")
                        .description("Clásicos")
                        .imageUrl("https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500")
                        .status(Product.Status.ACTIVE)
                        .build(),

                Product.builder()
                        .name("Vans Old Skool")
                        .price(new BigDecimal("75.00"))
                        .stock(60)
                        .category(lifestyle)
                        .brand("Vans")
                        .description("Skate style")
                        .imageUrl("https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500")
                        .status(Product.Status.ACTIVE)
                        .build()

        );

        productRepository.saveAll(products);

        System.out.println(">> Productos INICIALIZADOS");
    }
}