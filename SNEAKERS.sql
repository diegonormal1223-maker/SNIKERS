create database SNIKERS;
use SNIKERS;


CREATE TABLE usuario (
    id_usu INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usu VARCHAR(100) NOT NULL,
    apellido_usu VARCHAR(100) NOT NULL,
    email_usu VARCHAR(100) NOT NULL,
    contrasena_usu VARCHAR(255) NOT NULL, 
    rol_usu VARCHAR (20) NOT NULL,
    fecha_creacion DATETIME NOT NULL
);

CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_cli VARCHAR(100) NOT NULL,
    apellido_cli VARCHAR(100),
    email_cli VARCHAR(100),
    telefono_cli VARCHAR(20),
    direccion_envio_cli VARCHAR(255),
    fecha_registro_cli  DATETIME
);

CREATE TABLE producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_pro VARCHAR(255) NOT NULL,
    descripcion_pro  varchar (2000) NOT NULL,
    precio_prod bigint NOT NULL,
    marca_prod VARCHAR(100) NOT NULL,
    modelo_prod VARCHAR(100) NOT NULL,
    categoria_prod VARCHAR (100) NOT NULL
);



CREATE TABLE inventario (
    id_inventario INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    talla BIGINT NOT NULL, 
    color VARCHAR(50) NOT NULL,
    stock INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);


CREATE TABLE pedido (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    fecha_pedido datetime,
    estado varchar (30) NOT NULL,
    total bigint NOT NULL,
    direccion_envio_pedido VARCHAR(255),
    metodo_pago VARCHAR(50),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);



CREATE TABLE venta (
    id_venta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_pedido INT NOT NULL,
    id_inventario INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario bigint not null,
    subtotal bigint not null,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_inventario) REFERENCES inventario(id_inventario)
);









--  Descontar Stock al Registrar una Venta (AFTER INSERT)

DELIMITER $$
CREATE TRIGGER tr_venta_insert_descontar_stock
AFTER INSERT ON venta
FOR EACH ROW
BEGIN
    -- Descontar stock del inventario
    UPDATE inventario
    SET stock = stock - NEW.cantidad
    WHERE id_inventario = NEW.id_inventario;
END$$
DELIMITER ;

-- 2. Trigger: Ajustar Stock al Modificar Cantidad Vendida (AFTER UPDATE)

DELIMITER $$
CREATE TRIGGER tr_venta_update_ajustar_stock
AFTER UPDATE ON venta
FOR EACH ROW
BEGIN
    -- Ajustar stock. (OLD.cantidad - NEW.cantidad) es la diferencia de stock a aplicar.
    -- Si la nueva cantidad es menor, se devuelve stock (el resultado es positivo).
    -- Si la nueva cantidad es mayor, se resta más stock (el resultado es negativo).
    UPDATE inventario
    SET stock = stock + (OLD.cantidad - NEW.cantidad)
    WHERE id_inventario = NEW.id_inventario;
END$$
DELIMITER ;

-- 3. Trigger: Devolver Stock al Eliminar Artículo (AFTER DELETE)

DELIMITER $$
CREATE TRIGGER tr_venta_delete_devolver_stock
AFTER DELETE ON venta
FOR EACH ROW
BEGIN
    -- Devolver la cantidad eliminada al inventario
    UPDATE inventario
    SET stock = stock + OLD.cantidad
    WHERE id_inventario = OLD.id_inventario;
END$$
DELIMITER ;

DELIMITER ;