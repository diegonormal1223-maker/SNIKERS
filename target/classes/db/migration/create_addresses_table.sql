-- Crear tabla addresses para gestión de direcciones de usuarios
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    label VARCHAR(50),
    recipient_name VARCHAR(100),
    full_name VARCHAR(100),
    street_address VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Colombia',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índice para mejorar consultas por usuario
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Índice para dirección predeterminada
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default);
