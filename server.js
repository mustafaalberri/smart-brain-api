const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
// const dotenv = require('dotenv');

// dotenv.config();

const app = express();

const RedisStore = require("connect-redis").default;
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
})

// Test connection
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'session:',
  ttl: 3600 * 24, // 1 day
  logErrors: true,
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    path: '/',
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60, // 60 minutes
  },
  resave: true,
  saveUninitialized: false,
  store: redisStore,
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({
  origin: 'https://mustafaalberri.github.io',
  credentials: true,
  allowedHeaders: ['Content-Type'],
}));

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

const users = require('./controllers/users');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is up and running with port: ${port}`);
});

const pat = process.env.PAT;

app.get('/users', (req, res) => users.getUsers(req,res, db));
app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.getProfile(req, res, db));
app.put('/image', (req, res) => image.incrementEntries(req, res, db));
app.post('/detect', (req,res) => image.imageDetect(req,res, pat));
app.get('/loggedin', (req, res) => signin.handleLogin(req, res, db));
app.get('/logout', (req, res) => signin.handleLogout(req, res));