# tp-api-node
Taller web 2. API en node.js usando express.js. Base de datos mysql

Primero con el script sql crear la base y tablas.


Sobre el directorio del proyecto:
-npm install
-npm install -g nodemon
-nodemon

Se abrirá por defecto en http://localhost:3050




Rutas:

--Devuelve todos los productos
http://localhost:3050/productos

--Devuelve un solo producto
http://localhost:3050/producto/id

--Crea un producto
http://localhost:3050/crearProducto

el body para enviar a la API la creacion del producto debera ser como el siguiente ejemplo
{
    "nombre": "Arroz",
    "precio": 120,
    "img": "https://diaio.vtexassets.com/arquivos/ids/228450",
    "descripcion": "arroz",
    "clasificacion": "comestible"
}
