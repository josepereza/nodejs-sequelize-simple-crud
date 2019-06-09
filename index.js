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
  
    Post.associate = (models) => {
      Post.belongsTo(models.author);
    };
  
    const Author = sequelize.define('author', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING
      },
      {
        freezeTableName: true,
      }
    );
  
    Author.associate = (models) => {
      Author.hasMany(models.post);
    };


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
    
    sequelize.query("select post.id,post.title,post.content,author.firstName  from post inner join author  on post.authorId=author.id").then( (results) =>
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
  );

  app.get( "/author/:id", (req, res) =>
    Author.findByPk(req.params.id).then( (result) => res.json(result))
);
app.get( "/author", (req, res) =>
    Author.findAll().then( (result) => res.json(result))
);



//static files

app.use(express.static('public'));

sequelize.sync();
       
 
  app.listen(8080, () => console.log("App listening on port 8080!"));

