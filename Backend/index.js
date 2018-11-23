var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require ('mongoose');

//password utils
var genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
  .toString('hex') //convert to hexa format
  .slice(0,length);
}

var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password, salt);
  var value = hash.digest('hex');
  return{
    salt:salt,
    passwordHash:value
  };
};

function saltHashPassword(userPassword){
    var salt = genRandomString(16); 
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}

function checkHashPassword(userPassword,salt){
  var passwordData = sha512(userPassword,salt);
  return passwordData;
}

//Create express server 
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Create mongoDB client
var MongoClient = mongodb.MongoClient;

//Connection to mongodb
var url = 'mongodb://localhost:27017'

MongoClient.connect(url,{useNewUrlParser:true}, function(err,client){
  if(err)
      console.log('Unable to connect.', err);
  else{
    //Register part
    app.post('/register', (request, response, next)=>{
      var post_data = request.body;

      var plaint_password = post_data.password;
      var hash_data = saltHashPassword(plaint_password);

      var password = hash_data.passwordHash; //save password
      var salt = hash_data.salt; // save salt

      var name = post_data.name;
      var email = post_data.email;

      var insertJson = {
        'email': email,
        'password': password,
        'salt': salt,
        'name': name
      };
      var db = client.db('DBchat');

      //Verify if exists email
      db.collection('user')
        .find({'email':email}).count(function(err,number){
          if(number != 0)
          {
            response.json('Email exists');
            console.log('Email exists');
          }
          else{
            //Insert data
            db.collection('user')
                .insertOne(insertJson, function(error, res){
                  response.json('Registration success');
                  console.log('Registration success');
                })
          }
        })

    });
    app.post('/login', (request, response, next)=>{
      var post_data = request.body;

      var email = post_data.email;
      var userPassword = post_data.password;

      var db = client.db('DBchat');

      //Verify if exists email
      db.collection('user')
        .find({'email':email}).count(function(err,number){
          if(number == 0)
          {
            response.json('Email not exists');
            console.log('Email not exists');
          }
          else{
            //Insert data
            db.collection('user')
                .findOne({'email':email}, function(err,user){
                  var salt = user.salt;
                  var hashed_password = checkHashPassword(userPassword, salt).passwordHash;
                  var encrypted_password = user.password;
                  if(hashed_password == encrypted_password){
                    response.json('Login success');
                    console.log('Login success');
                  }
                  else{
                    response.json('Wrong password');
                    console.log('Wrong password');
                  }
                })
          }
        })

    });

    //Start server
    app.listen(3000,()=>{
      console.log('Connected on port 3000');
    })
  }
})




/*var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId;
var assert = require('assert'); 
var mongoose = require ('mongoose');
http = require('http'),
app = express(),

server = http.createServer(app),
io = require('socket.io').listen(server);

app.get('/', (req, res) => {
res.send('Chat Server on port 3000')
});

server.listen(3000,()=>{
console.log('Node app on port 3000')
});

//const PizzaSchema = require('../model/schema');
var url = 'mongodb://localhost:27017/PizzasDB'
//Mostrar todas las pizzas
router.get('/', function(req, res, next) {
  var Pizza = []; 
  //Conectar a mongodb para obtener las pizzas
  mongoose.connect(url, function(err, db){
    assert.equal(null, err); 
    var cursor = db.collection('pizzas').find(); 
    cursor.forEach(function(doc, err){
      assert.equal(null, err); 
      Pizza.push(doc)
    }, function(){
      db.close(); 
      if(err) return next(createError(500))
      res.status(202).render('index', { title: 'Pizzas',  pizzas: Pizza});
    }); 
    
  }); 
});

//Agregar nueva pizza
router.post('/addPizza', function(req, res, next){
  var Pizza = new PizzaSchema({
    nombre: req.body.newNombre,
    descripcion: req.body.newDescripcion,
    ingredientes: req.body.newIngredientes,
    tipomasa: req.body.newTipoMasa,
    tamano: req.body.newTamano,    
    cantidadporciones: req.body.newCantidadPorciones,
    tieneextraqueso: req.body.newExtraQueso
  })
  mongoose.connect(url, function(err, db){
    if(err){
      console.error(err); 
    }
    db.collection('pizzas').insertOne(Pizza, function(err, result){
      assert.equal(null, err); 
      console.log('Added'); 
      db.close(); 
      if(err) return next(createError(500))
      res.status(202).redirect('/'); 
    }); 
  });
});

//Eliminar una pizza
router.post('/:id/delete', function(req, res, next){
  var id = req.body.valuesToDelete; 
  console.log(id); 
  mongoose.connect(url, function(err, db){
    if(err) console.error(err); 
    db.collection('pizzas').deleteOne({"_id": objectId(id)}, function(err, results){
      if(err) console.error(err);  
      console.log("Deleted."); 
      var cursor = db.collection('pizzas').find(); 
      var Pizza = []; 
      cursor.forEach(function(doc, err){
        assert.equal(null, err); 
        Pizza.push(doc)
      }, function(){ 
        db.close(); 
        if(err) return next(createError(500))
        res.status(202).redirect('/');
      }); 
    });
  });
}); 
//Mostrar una pizza
router.get('/verPizza/:id', function(req, res, next){
  var id = req.params.id;  
  console.log(id); 
 
  mongoose.connect(url, function(err, db){
    assert.equal(null, err); 
    var found = db.collection('pizzas').findOne({"_id": objectId(id)}, function(err, result){
      if(err) console.error(err); 
      if(err) return next(createError(500))
      res.status(202).render('mostrar', {item: result}); 
    }); 
  });
});

//Regresar al index
router.get('/goBack', function(req, res, next){
  res.redirect('/'); 
});

//Editar una pizza
router.get('/edit/:id', function(req, res, next){
  var id = req.params.id;
  mongoose.connect(url, function(err, db){ 
    assert.equal(null, err); 
    var found = db.collection('pizzas').findOne({"_id": objectId(id)}, function(err, result){
      if(err) console.error(err); 
      if(err) return next(createError(500))
      res.status(202).render('edit', {item: result}); 
    }); 
  });
});

//Actualizar una piza
router.post('/update', function(req, res, next){
  var editedPizza = {
    nombre: req.body.newNombre,
    descripcion: req.body.newDescripcion,
    ingredientes: req.body.newIngredientes,
    tipomasa: req.body.newTipoMasa,
    tamano: req.body.newTamano,    
    cantidadporciones: req.body.newCantidadPorciones,
    tieneextraqueso: req.body.newExtraQueso
  }
  var id = req.body.valuesToDelete; 
  mongoose.connect(url, function(err, db){
    assert.equal(null, err); 
    db.collection('pizzas').updateOne({"_id": objectId(id)}, {$set: editedPizza}, function(err, result){
      if(err) return next(createError(500))
      res.status(202).redirect('/'); 
    });
  }); 
});  

module.exports = router; */
