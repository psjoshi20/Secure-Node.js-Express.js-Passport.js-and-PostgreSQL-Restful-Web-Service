The comprehensive step by step tutorial on building secure Node.js, Express.js, Passport.js, and PostgreSQL Restful Web Service. Previously, we have shown you a combination of Node.js, Express.js, and PostgreSQL tutorial. Now, we just add security for that REST API Web Service endpoints. Of course, we will start this tutorial from scratch or from zero application. We will use JWT for this Node.js, Express.js, Passport.js, and PostgreSQL tutorial.

Secure Node.js, Express.js and PostgreSQL API using Passport.js
by Didin J. on Nov 24, 2018Secure Node.js, Express.js and PostgreSQL API using Passport.js
by Didin J. on Nov 24, 2018 www.djamware.com

Table of Contents:
Create Express.js Project and Install Required Modules
Add and Configure Sequelize.js Module and Dependencies
Create or Generate Sequelize Models and Migrations
Create Routers for REST API Web Service and Authentication
Run and Test Secure Node.js, Express.js, Passport.js, and PostgreSQL Web Service
The following tools, frameworks, and modules are required for this tutorial:

Node.js
PostgreSQL Server
Express.js
Sequelize.js
Terminal or Command Line
Text Editor or IDE
Postman
We assume that you have installed PostgreSQL server in your machine or can use your own remote server (we are using PostgreSQL 9.5.13). Also, you have installed Node.js on your machine and can run `node`, `npm` or `yarn` command in your terminal or command line. Next, check their version by type this commands in your terminal or command line.

node -v
v8.12.0
npm -v
6.4.1
yarn -v
1.10.1
That the versions that we are uses. Let's continue with the main steps.

Create Express.js Project and Install Required Modules
Using Express.js with a myriad of HTTP utility methods and middleware at your disposal, creating a robust API is quick and easy. Open your terminal or node command line the go to your projects folder. First, install express-generator using this command.

sudo npm install express-generator -g
Next, create an Express.js app using this command.

express secure-node --view=ejs
This will create Express.js project with the EJS view instead of Jade view template because using '--view=ejs' parameter. Next, go to the newly created project folder then install node modules.

cd secure-node && npm install
You should see the folder structure like this.

Secure Node.js, Express.js and PostgreSQL API using Passport.js - Project Structure

There's no view yet using the latest Express generator. We don't need it because we will create a RESTful API.


Add and Configure Sequelize.js Module and Dependencies
Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more. Before installing the modules for this project, first, install Sequelize-CLI by type this command.

sudo npm install -g sequelize-cli
To install Sequelize.js module, type this command.

npm install --save sequelize
Then install the module for PostgreSQL.

npm install --save pg pg-hstore
Next, create a new file at the root of the project folder.
touch .sequelizerc
Open and edit that file then add these lines of codes.

const path = require('path');

module.exports = {
  "config": path.resolve('./config', 'config.json'),
  "models-path": path.resolve('./models'),
  "seeders-path": path.resolve('./seeders'),
  "migrations-path": path.resolve('./migrations')
};
That files will tell Sequelize initialization to generate config, models, seeders and migrations files to specific directories.  Next, type this command to initialize the Sequelize.

sequelize init
That command will create `config/config.json`, `models/index.js`, `migrations` and `seeders` directories and files. Next, open and edit `config/config.json` then make it like this.

{
  "development": {
    "username": "djamware",
    "password": "dj@mw@r3",
    "database": "secure_node",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": "dj@mw@r3",
    "database": "secure_node",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": "dj@mw@r3",
    "database": "secure_node",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
We use the same configuration for all the environment because we are using the same machine, server, and database for this tutorial.

Before run and test connection, make sure you have created a database as described in the above configuration. You can use the `psql` command to create a user and database.
psql postgres --u postgres
Next, type this command for creating a new user with password then give access for creating the database.

postgres-# CREATE ROLE djamware WITH LOGIN PASSWORD 'dj@mw@r3';
postgres-# ALTER ROLE djamware CREATEDB;
Quit `psql` then log in again using the new user that previously created.

postgres-# \q
psql postgres -U djamware
Enter the password, then you will enter this `psql` console.
psql (9.5.13)
Type "help" for help.

postgres=>
Type this command to creating a new database.

postgres=> CREATE DATABASE secure_node;
Then give that new user privileges to the new database then quit the `psql`.

postgres=> GRANT ALL PRIVILEGES ON DATABASE secure_node TO djamware;
postgres=> \q

Create or Generate Sequelize Models and Migrations
We will use Sequelize-CLI for generating a new model. Type this command to create a model for `Products` and `User` model for authentication.

sequelize model:create --name Product --attributes prod_name:string,prod_desc:string,prod_price:float
sequelize model:create --name User --attributes username:string,password:string
That command creates a model file to the model's folder and a migration file to folder migrations. Next, modify `models/user.js` and then import this module.
var bcrypt = require('bcrypt-nodejs');

Add the new methods to the User model, so the `user.js` class will be like this.

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
  };
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
For the `models/product.js` there's no action needed, leave it as default generated the model class.


Create Routers for REST API Web Service and Authentication
To authenticate users and secure the resources or endpoint create this file as a router.

touch routes/api.js
Open and edit `routes/api.js` then declares all require variables.

const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const Product = require('../models').Product;
const User = require('../models').User;
Create a router for signup or register the new user.

router.post('/signup', function(req, res) {
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    res.status(400).send({msg: 'Please pass username and password.'})
  } else {
    User
      .create({
        username: req.body.username,
        password: req.body.password
      })
      .then((user) => res.status(201).send(user))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  }
});
Create a router for sign in or log in with username and password.

router.post('/signin', function(req, res) {
  User
      .find({
        where: {
          username: req.body.username
        }
      })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            message: 'Authentication failed. User not found.',
          });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err) {
            var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
            jwt.verify(token, 'nodeauthsecret', function(err, data){
              console.log(err, data);
            })
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        })
      })
      .catch((error) => res.status(400).send(error));
});
Create a secure router to get and post product data.

router.get('/product', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Product
      .findAll()
      .then((products) => res.status(200).send(products))
      .catch((error) => { res.status(400).send(error); });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/product', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Product
      .create({
        prod_name: req.body.prod_name,
        prod_desc: req.body.prod_desc,
        prod_price: req.body.prod_price
      })
      .then((product) => res.status(201).send(product))
      .catch((error) => res.status(400).send(error));
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});
Create a function to extract the token.
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
Finally, export the router as a module.

module.exports = router;

Run and Test Secure Node.js, Express.js, Passport.js, and PostgreSQL Web Service
To run and test this secure Node.js, Express.js, Passport.js, and PostgreSQL Web Service, run the PostgreSQL instance first then run this command from the Terminal.

nodemon
or

npm start
To test the secure Product endpoint, open the Postman then type fill all required fields like this image.

Secure Node.js, Express.js and PostgreSQL API using Passport.js - Postman GET

You should get the response message `Unauthorized` and status code `401`. Next, test signup using the Postman by changing the method to `POST`, add the address `localhost:3000/api/signup`, add the header `Content-type` with value `application/json` and the body of request raw text like this.

{ "username":"didin@djamware.com", "password":"qqqq1111" }
You should get this response when executing successfully.




Next, test to log in with the above signed/registered username and password by changing the URL to `localhost:3000/api/signin`. You should get this response when executes successfully.

Secure Node.js, Express.js and PostgreSQL API using Passport.js - Postman POST Signin

Now, you can back using the previous GET method with an additional header using the token get from the sign-in/log in response. You should see the Product data like below.

Secure Node.js, Express.js and PostgreSQL API using Passport.js - Postman Secure GET

That it's, the secure Node.js, Express.js, Passport.js, and PostgreSQL Web Service. You can get the working source code from our GitHub.

T


