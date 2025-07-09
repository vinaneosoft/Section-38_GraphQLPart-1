const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
//var { graphqlHttp } = require("express-graphql")
const  {createHandler} =require("graphql-http/lib/use/express")
const graphqlSchema = require('./graphql/schema');
//const graphqlResolver = require('./graphql/resolvers');

const app = express();
const fileStorage= multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g. 1625155565-123456789.jpg
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
 multer({ storage: fileStorage }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

/* app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
  })
);  */

app.all(
    "/graphql",
    createHandler({
      schema:graphqlSchema
    })
  );

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
     'mongodb+srv://root:root@cluster0.nhepvqi.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
  )  
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
