var express = require('express');
var mongoose = require ('mongoose');
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var app = express();

var url = 'mongodb://localhost:27017/chat'
//Conect to DB
mongoose.connect(url);
//Express
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Routes
app.use('/api', require('./routes/api'));

//start server
app.listen(3000);
console.log('Server running on port 3000');

/*


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
