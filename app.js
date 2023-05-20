const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;



app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Aumentar el límite de tamaño de carga útil (payload) a 10MB
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


//MySQL conexion 
// let connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'abcd',
//     database: 'tptaller'
// });

// //Configuracion de cognito
// var poolData = {
//     UserPoolId: "us-east-1_mAolZ5VrD",
//     ClientId: "2agsnegmb1t54jjnvofdsk4n2l"
// };

// var userPool = new CognitoUserPool(poolData);

//======================================
//Rutas API Productos
//======================================
app.get('/', (req, res) => {
    res.send('API!');
});

// //Traer todos los productos
// app.get('/productos', (req, res) => {
//     const sql = 'SELECT * FROM PRODUCTOS';

//     connection.query(sql, (error, resultados) => {
//         if (error) throw error;
//         if (resultados.length > 0) {
//             res.json(resultados);
//         } else {
//             res.send('No se encontraron productos');
//         }
//     });
// });

// //Traer un producto 
// app.get('/producto/:id', (req, res) => {
//     const {
//         id
//     } = req.params;
//     const sql = `SELECT * FROM PRODUCTOS WHERE id = ${id}`;
//     connection.query(sql, (error, resultado) => {
//         if (error) throw error;
//         if (resultado.length > 0) {
//             res.json(resultado);
//         } else {
//             res.send('No se encontro ningun producto');
//         }
//     });

// });


//Crear nuevo producto
// app.post('/crearProducto', (req, res) => {
//     const sql = 'INSERT INTO PRODUCTOS SET ?';

//     const productoObj = {
//         nombre: req.body.nombre,
//         precio: req.body.precio,
//         img: req.body.img,
//         descripcion: req.body.descripcion,
//         clasificacion: req.body.clasificacion
//     };

//     connection.query(sql, productoObj, error => {
//         if (error) throw error;
//         res.send('Producto creado.');
//     });
// });

const multer = require('multer');
const upload = multer();

// app.post('/pruebaPost', (req, res) => {
//         res.status(200).json({ mensaje: '¡Prueba exitosa!' });
// });

app.post('/pruebaPost', upload.fields([
    { name: 'imagenDniFrente', maxCount: 1 },
    { name: 'imagenDniReverso', maxCount: 1 },
    { name: 'imagenSosteniendoDni', maxCount: 1 }
  ]), (req, res) => {
    const { dni, nombre, apellido, mail, password } = req.body;
    const { imagenDniFrente, imagenDniReverso, imagenSosteniendoDni } = req.files;
  
    if (dni && nombre && apellido && mail && password && imagenDniFrente && imagenDniReverso && imagenSosteniendoDni) {
      // Aquí puedes procesar los campos y los archivos según tus necesidades
      // Por ejemplo, puedes guardar los archivos en una ubicación específica
  
      res.status(200).json({ mensaje: '¡Prueba exitosa!' });
    } else {
      res.status(400).json({ mensaje: 'Faltan campos o archivos del formulario' });
    }
  });

//check conexion
// connection.connect(error => {
//     if (error) throw error;
//     console.log('DB ok!');
// });

app.listen(PORT, () => console.log(`Server corriendo en port ${PORT}`));