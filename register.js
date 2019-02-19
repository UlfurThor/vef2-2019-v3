const express = require('express');
const {
  check,
  validationResult,
} = require('express-validator/check');
const {
  sanitize,
} = require('express-validator/filter');
const xss = require('xss');
const {
  createApplication,
} = require('./db');

const users = require('./users');

const router = express.Router();

router.use(express.urlencoded({
  extended: true,
}));

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function sanitizeUser(data) {
  const safeData = data;
  safeData.userName = xss(data.userName);
  safeData.email = xss(data.email);
  safeData.name = xss(data.name);
  safeData.password01 = ''; // prevents returning the password
  safeData.password02 = ''; // prevents returning the password

  return safeData;
}

/**
 * Handles error cheking for data
 * @param {*} data
 * @param {*} req
 */
async function validData(data, req) {
  const errors = validationResult(req);
  // console.log(data);

  let passNoMatch = false;
  if (data.password01 !== data.password02) {
    passNoMatch = false;
  }
  const userTaken = await users.db.getIfUsernameTaken(data.userName);

  if (!errors.isEmpty() || passNoMatch || userTaken) {
    const err = {};
    err.msgList = errors.array().map(i => i.msg);
    for (let j = 0; j < errors.array().length; j += 1) {
      err[errors.array()[j].param] = true;
    }

    if (passNoMatch) {
      err.msgList.push('Lykilorð verða að vera eins');
      err.password01 = true;
    }

    if (userTaken) {
      err.msgList.push('Notendanafn frátekið');
      err.userName = true;
    }

    return err;
  }

  return undefined;
}

// ------------------------------------------------------------------------------------------
/**
 * Genarates application page
 * @param {*} req
 * @param {*} res
 */
async function page(req, res) {
  console.info('--- page> register - get');

  res.render('register', {
    title: 'Nýskráning',
  });
}

// ------------------------------------------------------------------------------------------
/**
 * Gets application, evaluates it, and returns either error page,
 *     or uploads it and returns thank you page
 * @param {*} req
 * @param {*} res
 */
async function submit(req, res) {
  console.info('--- page> register - get');
  const data = req.body;

  const errors = await validData(data, req);
  if (errors !== undefined) {
    const safeData = sanitizeUser(data);

    res.render('register', {
      title: 'Nýskráning - Villur',
      err: errors,
      data: safeData,
    });
    return;
  }
  try {
    const haedPass = await users.hash(data.password01); // TODO FIX PASSWORD HASHING
    await users.db.createUser(data);
  } catch (err) {
    throw new Error(err);
  }
  res.render('thanks', {
    title: 'Þakkir',
  });
}

router.post('/',
  check('name').isLength({
    min: 1,
  }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({
    min: 1,
  }).withMessage('Email má ekki vera tómt'),
  check('email').isEmail().withMessage('Email verður að fera í réttu formi'),
  check('userName').isLength({
    min: 1,
  }).withMessage('Notendanafn má ekki vera tómt'),
  check('password01').isLength({
    min: 8,
  }).withMessage('Lykilorð verður að vera minst 8 stafir'),


  sanitize('name').trim().escape(),
  sanitize('email').normalizeEmail(),
  sanitize('userName').trim().escape(),
  sanitize('password01').trim().escape(),
  sanitize('password02').trim().escape(),
  catchErrors(submit));

router.get('/', catchErrors(page));

module.exports = router;
