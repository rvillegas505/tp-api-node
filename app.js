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


//MySQL conexion 
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd',
    database: 'tptaller'
});

//Configuracion de cognito
var poolData = {
    UserPoolId: "us-east-1_mAolZ5VrD",
    ClientId: "2agsnegmb1t54jjnvofdsk4n2l"
};

var userPool = new CognitoUserPool(poolData);

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
//Rutas API VENTAS
//======================================

//Crear nuevo venta
app.post('/crearVenta', (req, res) => {
    const sql = 'INSERT INTO VENTA SET ?';

    const productoObj = {
        idProducto: req.body.idProducto,
    };

    connection.query(sql, productoObj, error => {
        if (error) throw error;
        res.send('Producto creado.');
    });
});


app.post('/comprar', function (req, res) {
   var data = req.body;
   let respuestaAPI = [];
   let resultadoID;

   connection.query('INSERT INTO NUM_VENTA VALUES ();', function(error, result) {
    if (error) throw error;
    resultadoID = result.insertId;

        data.forEach(function (item) {
            respuestaAPI.push(item.data.id);
            const sql = `INSERT INTO VENTAS (id_venta, id_producto, cantidad) VALUES (${resultadoID}, ${item.data.id}, ${item.cantidad});`;
            connection.query(sql, error => {
            if (error) throw error;
            });
        });
    });
   res.send('venta creada');

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
            console.log('Error: ' + err.message || JSON.stringify(err));
            res.send('Ya existe usuario con mail: ' + usuarioObj.email +'  Error:'+ JSON.stringify(err.message));           
            return;
        }
        cognitoUser = result.user;
       
        connection.query(sql, usuarioObj, error => {
            if (error) throw error + 'Error al registrar usuario2';
            res.send('Usuario creado. Se envio un maaaaaaaaaaaail de confirmacion a: ' + usuarioObj.email);
        });

        res.send('Usuario creado. Se envio un mail de confirmacionnnnnnnn a: ' + usuarioObj.email);
        console.log('Usuario creado. Se envio un mail de confirmacion a: ' + usuarioObj.email);
    });
});

//LOGIN DE UN USUARIO
app.post('/login', (req, res) => {
 
    var authenticationData = {
        Username : req.body.email,
        Password : req.body.pass,
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var userData = {
        Username :req.body.email,
        Pool : userPool
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            var idToken = result.idToken.jwtToken;
            var refreshToken = result.refreshToken.token;
            console.log('access token + ' + accessToken);
            console.log('id token + ' + idToken);
            console.log('refresh token + ' + refreshToken);
            console.log('Usuario logueado.');
            


            res.locals.user = cognitoUser;
            res.send('Usuario logueado.');

        },

        onFailure: function(err) {
            console.log('Logueo Error: ' + err.message);
            res.send('Logueo Error: '+ err.message);
        },

    });
});

//USUARIO ACTUAL LOGUEADO
app.get('/usuarioActual', (req, res) => {

    var sessionUsuario = {};

    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                console.log(err);
                return;
            }

            cognitoUser.getUserAttributes(function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                for (i = 0; i < result.length; i++) {
                    sessionUsuario[result[i].getName()] = result[i].getValue();
                    //console.log(JSON.stringify(result[i].getName()+': '+result[i].getValue()));
                    //console.log(result[i].getName() + ':' + result[i].getValue());
                }
                Window.localStorage.setItem('sessionUsuario', JSON.stringify(sessionUsuario));
                console.log('Usuario actual logueado: ' + JSON.stringify(sessionUsuario));
                res.send(JSON.stringify(sessionUsuario));
            });
            
        });
    }

    //console.log('usuario actual: ' + cognitoUser.getUsername());
    
});

//DESLOGUEAR USUARIO
app.post('/logout', (req, res) => {
    var cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
    console.log('Usuario deslogueado.');
    res.send("Deslogueado");
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


//DESLOGUEAR USUARIO
app.post('/desloguear', (req, res) => {
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.signOut();
        console.log('Usuario deslogueado.');
        res.send('Usuario deslogueado.');
    }else{
        console.log('No hay usuario logueado.');
        res.send('No hay usuario logueado.');
    }
});

//check conexion
connection.connect(error => {
    if (error) throw error;
    console.log('DB ok!');
});

app.listen(PORT, () => console.log(`Server corriendo en port ${PORT}`));