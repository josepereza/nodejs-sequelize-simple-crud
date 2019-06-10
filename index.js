const express = require('express');
const path = require('path');
const Sequelize = require('sequelize')
const bodyParser = require('body-parser')
var methodOverride = require('method-override')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
const sequelize = new Sequelize('sequelize1', 'jose', '12345Seis', {
    host: 'localhost',
    dialect: 'mysql'
  })

  sequelize.authenticate()
  .then(() => {
    console.log('Conectado')
  })
  .catch(err => {
    console.log('No se conecto')
  })

//define
const Post = sequelize.define('post', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: Sequelize.STRING,
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        authorId: Sequelize.INTEGER
      },
      {
        freezeTableName: true,
      }
    );
  
    
  
    const Author = sequelize.define('author', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        firstName: {
          type:Sequelize.STRING,
          allowNull: false
        },
        lastName: Sequelize.STRING
      },
      {
        freezeTableName: true,
      }
    );
  
//sincronizar
sequelize.sync();    

//settings
app.set('port', 3000);
app.set('view engine', 'ejs');
//middlewares
app.use(methodOverride('_method'))

//routes 
app.get('/', (req, res) =>{
    res.render('index', {title: 'MI APP'});

})

app.get( "/posts", (req, res) =>{
    
    Post.findAll().then( (result) => res.json(result))
        
});

app.get( "/listado_posts", (req, res) =>{
    
    sequelize.query("select post.id,post.title,post.content,author.firstName  from post inner join author  on post.authorId=author.id order by post.id").then( (results) =>
  {      res.render('post',{data: results});
         console.log(results);
        
 } )
  
 });

 app.get("/edit_post/:id", (req, res) =>
 
 Post.findByPk(req.params.id).then( (result) => res.render('edit',{result}))
 
  );

  app.post("/post", (req, res) => 
  Post.create({
     title: req.body.titulo,
     content: req.body.contenido,
     authorId: req.body.autor
   }).then( (result) => res.json(result) )
   .catch((error)=> {
    console.log("ops: " + error);
    res.status(500).json({ error: "error" });
  })

 );


 app.put( "/post/:id", (req, res) =>
    Post.update({
      title: req.body.titulo,
      content: req.body.contenido
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
  );

  app.delete("/post/:id", (req, res) =>
    Post.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
    .catch(function(error) {
      console.log("ops: " + error);
      res.status(500).json({ error: "error" });
    })

  );

  app.post("/author", (req, res) => {
  
  Author.create({
   // firstName: "jose",
   // lastName: "martinez"
    firstName: req.body.nombre,
    lastName: req.body.apellido
     
   })
   .then( (result) => res.json(result) )
   .catch(error => res.json({
    error:true,
    data: [],
    error: error
}))

  });

  app.get( "/author/:id", (req, res) =>
    Author.findByPk(req.params.id).then( (result) => res.json(result))
);
app.get( "/author", (req, res) =>
    Author.findAll().then( (result) => res.json(result))
);


//static files

app.use(express.static('public'));


       
 
  app.listen(8080, () => console.log("App listening on port 8080!"));

