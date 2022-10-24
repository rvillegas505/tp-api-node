const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const bodyPaser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();
app.use(cors());

app.use(bodyPaser.json());


//MySQL conexion 
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'tptaller'
});

//======================================
//Rutas API Productos
//======================================
app.get('/', (req, res) =>{
    res.send('API!');
});

//Traer todos los productos
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM PRODUCTOS';

    connection.query(sql, (error, resultados) => {
        if (error) throw error;
        if (resultados.length > 0 ){
            res.json(resultados);
        } else {
            res.send('No se encontraron productos');
        }
    });
});

//Traer un producto 
app.get('/producto/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM PRODUCTOS WHERE id = ${id}`;
    connection.query(sql, (error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0 ){
            res.json(resultado);
        } else {
            res.send('No se encontro ningun producto');
        }
    });

});


//Crear nuevo producto
app.post('/crearProducto', (req, res) => {
    const sql = 'INSERT INTO PRODUCTOS SET ?';

    const productoObj = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        img:    req.body.img,
        descripcion: req.body.descripcion,
        clasificacion: req.body.clasificacion
    };

    connection.query(sql, productoObj, error => {
        if (error) throw error;
        res.send('Producto creado.');
    });
});

//Actualizar producto
app.put('/actualizarProducto/:id', (req, res) => {
    const { id } = req.params;
    if( req.body.nombre != null 
        && req.body.precio != null 
        && req.body.img != null 
        && req.body.descripcion != null
        && req.body.clasificacion != null){
        const { nombre, precio, img, descripcion, clasificacion } = req.body;
        const productoObj = {
            nombre, 
            precio, 
            img, 
            descripcion, 
            clasificacion
        };
        const sql = `UPDATE productos 
                    SET nombre = '${nombre}',precio = '${precio}',
                    img = '${img}',descripcion = '${descripcion}',clasificacion = '${clasificacion}'
                    WHERE id = '${id}'`;
        connection.query(sql, productoObj, error => {
            if (error) throw error;
            res.send('Producto actualizado.');
        });
    } else {
        if (error) throw error;
        res.send('No se encontro ningun producto');
    }
});

//Borrar un producto
app.delete('/borrarProducto/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM PRODUCTOS WHERE id = '${id}'`;
    connection.query(sql, (error, resultado) => {
        if (error) throw error;
        res.send('Producto Borrado');
    });
});


//ultimoProducto
app.get('/ultimoProducto', (req, res) => {
    const sql = 'SELECT * FROM PRODUCTOS ORDER BY id DESC LIMIT 1';

    connection.query(sql, (error, resultados) => {
        if (error) throw error;
        if (resultados.length > 0 ){
            res.json(resultados);
        } else {
            res.send('No se encontraron productos');
        }
    });
});



//check conexion
connection.connect(error => {
    if (error) throw error;
    console.log('DB ok!');
  });

app.listen(PORT, () => console.log(`Server corriendo en port ${PORT}`));