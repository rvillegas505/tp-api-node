const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

const bodyPaser = require('body-parser');

const PORT = process.env.PORT || 3050;


app.use(cors());

app.use(bodyPaser.json());


//MySQL conexion 
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'tptaller'
});

//Configuracion de cognito
var poolData = {
    UserPoolId: "us-east-1_mAolZ5VrD",
    ClientId: "2agsnegmb1t54jjnvofdsk4n2l"
};



//======================================
//Rutas API Productos
//======================================
app.get('/', (req, res) => {
    res.send('API!');
});

//Traer todos los productos
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM PRODUCTOS';

    connection.query(sql, (error, resultados) => {
        if (error) throw error;
        if (resultados.length > 0) {
            res.json(resultados);
        } else {
            res.send('No se encontraron productos');
        }
    });
});

//Traer un producto 
app.get('/producto/:id', (req, res) => {
    const {
        id
    } = req.params;
    const sql = `SELECT * FROM PRODUCTOS WHERE id = ${id}`;
    connection.query(sql, (error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0) {
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
        img: req.body.img,
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
    const {
        id
    } = req.params;
    if (req.body.nombre != null &&
        req.body.precio != null &&
        req.body.img != null &&
        req.body.descripcion != null &&
        req.body.clasificacion != null) {
        const {
            nombre,
            precio,
            img,
            descripcion,
            clasificacion
        } = req.body;
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
    const {id} = req.params;
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
        if (resultados.length > 0) {
            res.json(resultados);
        } else {
            res.send('No se encontraron productos');
        }
    });
});

//======================================
//Rutas API Cognito
//======================================

//Registrar usuario
app.post('/registrarUsuario', (req, res) => {
    const sql = 'INSERT INTO USUARIO SET ?';

    const usuarioObj = {
        name: req.body.name,
        family_name: req.body.family_name,
        nickname: req.body.nickname,
        email: req.body.email,
        pass: req.body.pass,
        address: req.body.address

    };

   var attributeList = [];

   attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value:usuarioObj.name}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "family_name", Value:usuarioObj.family_name}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "nickname", Value:usuarioObj.nickname}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value:usuarioObj.email}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "address", Value:usuarioObj.address}));

    userPool.signUp(usuarioObj.email, usuarioObj.pass, attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            console.log('Ya existe usuario:');
            return;
        }
        connection.query(sql, usuarioObj, error => {
            if (error) throw error + 'Error al registrar usuario2';
            res.send('Usuario creado.');
        });
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
});

//LOGIN DE UN USUARIO
app.post('/login', (req, res) => {
 
    var authenticationData = {
        Username : req.body.email,
        Password : req.body.pass,
    };

    var userPool = new CognitoUserPool(poolData);

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var userData = {
        Username :req.body.email,
        Pool : userPool
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            console.log('Usuario logueado.');
            res.send('Usuario logueado.');
        },

        onFailure: function(err) {
            console.log('Logueo Error: ' + err.message);
            res.send('Logueo Error: '+ err.message);
        },

    });
});


//Obtener usuario por email
app.get('/obtenerUsuarioPorEmail/:email', (req, res) => {
    const {email} = req.params;
    const sql = `SELECT * FROM USUARIO WHERE email = '${email}'`;
    
    connection.query(sql, (error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.send('No se encontro ningun usuario');
        }
    });
} );




//check conexion
connection.connect(error => {
    if (error) throw error;
    console.log('DB ok!');
});

app.listen(PORT, () => console.log(`Server corriendo en port ${PORT}`));