const express = require('express');

const app = express();

/* Middleware*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Bcrypt hashing
const bcrypt = require('bcrypt');

const users = require('./controllers/users');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : 'dpg-cg7fr3pmbg5ab7g73ts0-a',
      port : 5432,
      user : 'sm_db_user',
      password : 'B9TVgUg49I60PH0U2aeJreaxMN4iYk98',
      database : 'sm_db'
    }
  });

// Setup Server.
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is up and running with port: ${port}`);
});

app.get('/users', (req, res) => users.getUsers(req,res, db));
app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.getProfile(req, res, db));
app.put('/image', (req, res) => image.incrementEntries(req, res, db));
app.post('/detect', (req,res) => image.imageDetect(req,res));
