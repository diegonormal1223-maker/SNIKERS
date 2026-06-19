package com.snikers.app.config;

import com.snikers.app.model.User;
import com.snikers.app.model.Category;
import com.snikers.app.model.Product;
import com.snikers.app.repository.UserRepository;
import com.snikers.app.repository.CategoryRepository;
import com.snikers.app.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.jdbc.datasource.init.DatabasePopulatorUtils;

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
    private final DataSource dataSource;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 INICIANDO CARGA DE DATOS... (Ejecución incondicional de scripts SQL)");
        try {
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource("snikers_db.sql"));
            populator.addScript(new ClassPathResource("update_orders_status.sql"));
            // Continuar en caso de advertencias
            populator.setContinueOnError(true);
            DatabasePopulatorUtils.execute(populator, dataSource);
            System.out.println("✅ Scripts SQL (snikers_db.sql y update_orders_status.sql) cargados exitosamente.");

            // Sincronizar y re-encriptar contraseñas de todos los usuarios cargados
            System.out.println("🔐 Sincronizando contraseñas de usuarios con el encriptador de la app...");
            List<User> allUsers = userRepository.findAll();
            for (User u : allUsers) {
                if ("admin@snikers.com".equalsIgnoreCase(u.getEmail())) {
                    u.setPassword(passwordEncoder.encode("Admin1234!"));
                } else {
                    u.setPassword(passwordEncoder.encode("Cliente1234!"));
                }
            }
            userRepository.saveAll(allUsers);
            System.out.println("✅ Contraseñas sincronizadas (admin: Admin1234!, clientes: Cliente1234!).");

        } catch (Exception e) {
            System.err.println("❌ Error al cargar los scripts SQL o sincronizar contraseñas: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("✅ CARGA DE DATOS COMPLETADA.");
    }

    private void seedUsers() {

        // ADMIN
        User admin = userRepository.findByEmail("admin@snikers.com")
                .orElse(
                        User.builder()
                                .name("Admin User")
                                .email("admin@snikers.com")
                                .role(User.Role.ADMIN)
                                .status(User.Status.ACTIVE)
                                .build());

        admin.setPassword(passwordEncoder.encode("Admin1234!"));

        userRepository.save(admin);

        System.out.println(">> ADMIN RESETEADO: admin@snikers.com / Admin1234!");

        // CLIENTE
        if (userRepository.findByEmail("cliente@snikers.com").isEmpty()) {

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
    }

    private void seedCategoriesAndProducts() {

        // Categorías
        if (categoryRepository.count() == 0) {

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

            categoryRepository.saveAll(
                    Arrays.asList(running, lifestyle, basket));

            System.out.println(">> Categorías CREADAS");
        }

        // Productos
        if (productRepository.count() == 0) {

            Category running = categoryRepository
                    .findByName("Running")
                    .orElse(null);

            Category lifestyle = categoryRepository
                    .findByName("Lifestyle")
                    .orElse(null);

            Category basket = categoryRepository
                    .findByName("Basquet")
                    .orElse(null);

            if (running != null &&
                    lifestyle != null &&
                    basket != null) {

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

            } else {

                System.out.println(
                        "!! Error: No se pudieron cargar productos porque faltan categorías."
                );
            }
        }
    }
}