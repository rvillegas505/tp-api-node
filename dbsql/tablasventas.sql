CREATE TABLE num_venta(
id int NOT NULL AUTO_INCREMENT,
PRIMARY KEY (id)
);

CREATE TABLE ventas(
id_venta int NOT NULL,
id_producto int NOT NULL,
FOREIGN KEY (id_venta) REFERENCES num_venta(id),
FOREIGN KEY (id_producto) REFERENCES productos(id)
);


INSERT INTO num_venta VALUES ();
INSERT INTO ventas (id_venta, id_producto) VALUES (1, 2);
INSERT INTO ventas (id_venta, id_producto) VALUES (1, 1);

SELECT * from num_venta;
SELECT * from ventas;