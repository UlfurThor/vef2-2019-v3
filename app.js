require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const {
  Strategy,
} = require('passport-local');

const apply = require('./apply');
const register = require('./register');
const admin = require('./admin');
const applications = require('./applications');
const users = require('./users');
const {
  isInvalid,
} = require('./utils');


const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  console.error('Add SESSION_SECRET to .env');
  process.exit(1);
}

const app = express();

// -------------------------------------------------------------------------------------------------
// session / passport config

app.use(express.urlencoded({
  extended: true,
}));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 20 * 1000, // 20 sek
}));


/**
 * Athugar hvort username og password sé til í notandakerfi.
 * Callback tekur við villu sem fyrsta argument, annað argument er
 * - `false` ef notandi ekki til eða lykilorð vitlaust
 * - Notandahlutur ef rétt
 *
 * @param {string} username Notandanafn til að athuga
 * @param {string} password Lykilorð til að athuga
 * @param {function} done Fall sem kallað er í með niðurstöðu
 */
async function strat(username, password, done) {
  try {
    const user = await users.db.getUserByusername(username);

    if (!user) {
      return done(null, false);
    }

    // Verður annað hvort notanda hlutur ef lykilorð rétt, eða false
    const valid = await users.comparePasswords(password, user.password);
    if (valid) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}

// Notum local strategy með „strattinu“ okkar til að leita að notanda
passport.use(new Strategy(strat));


// Notum local strategy með „strattinu“ okkar til að leita að notanda
passport.use(new Strategy(strat));

// Geymum id á notanda í session, það er nóg til að vita hvaða notandi þetta er
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Sækir notanda út frá id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.db.getUserByID(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Látum express nota passport með session
app.use(passport.initialize());
app.use(passport.session());

// Gott að skilgreina eitthvað svona til að gera user hlut aðgengilegan í
// viewum ef við erum að nota þannig
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    // getum núna notað user í viewum
    res.locals.user = req.user;
  }

  next();
});

// Hjálpar middleware sem athugar hvort notandi sé innskráður og hleypir okkur
// þá áfram, annars sendir á /login
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

function ensureAdmin(req, res, next) {
  if (req.user.admin) {
    return next();
  }

  return res.redirect('/user');
}

// -------------------------------------------------------------------------------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


app.locals.isInvalid = isInvalid;

/* **************************************************************************** */
app.get('/login', (req, res) => {
  console.info('--- page> login');
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  let message = '';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
  // og hreinsum skilaboð
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }
  // Ef við breytum name á öðrum hvorum reitnum að neðan mun ekkert virka
  console.log('req.isAuthenticated()', req.isAuthenticated());
  return res.render('login', {
    title: message,
    err: message,
    userAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
});


app.post(
  '/login',

  // Þetta notar strat að ofan til að skrá notanda inn
  passport.authenticate('local', {
    failureMessage: 'Notandi eða lykilorð vitlaust.',
    failureRedirect: '/login',
  }),

  // Ef við komumst hingað var notandi skráður inn, senda á /admin
  (req, res) => {
    res.redirect('/user');
  },
);

async function userPage(req, res) {
  console.info('--- page> user');
  console.info(req.user);

  if (req.isAuthenticated()) {
    return res.render('user', {
      title: `/Notandi: ${req.user.name}`,
      userAuthenticated: req.isAuthenticated(),
      user: req.user,
    });
  }

  return res.redirect('/login');
}
/* **************************************************************************** */

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.use('/', apply);
app.use('/register', register);
app.use('/applications', ensureLoggedIn, applications);
// app.use('/admin', admin);
app.use('/admin', ensureLoggedIn, admin); // TODO fix secure login
app.use('/user', ensureLoggedIn, userPage);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', {
    page: 'error',
    title: '404',
    error: '404 fannst ekki',
    userAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
}

function errorHandler(error, req, res, next) { // eslint-disable-line
  console.error(error);
  res.status(500).render('error', {
    page: 'error',
    title: 'Villa',
    error,
    userAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

const host = '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Running@ http://${host}:${port}/`);
});

/*
app.listen(port, host, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
*/
