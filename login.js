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
const {
  catchErrors,
} = require('./utils');


const users = require('./users');

const router = express.Router();

router.use(express.urlencoded({
  extended: true,
}));


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
 * Genarates login page
 * @param {*} req
 * @param {*} res
 */
async function page(req, res) {
  console.info('--- page> login - get');

  res.render('login', {
    title: 'Innskráning',
  });
}

// ------------------------------------------------------------------------------------------
/**
 * Gets login, evaluates it, and returns either error page,
 *     or logs user in before redirecting
 * @param {*} req
 * @param {*} res
 */
async function submit(req, res) {
  console.info('--- page> login - get');
  const data = req.body;

  const errors = await validData(data, req);
  if (errors !== undefined) {
    const safeData = sanitizeUser(data);

    res.render('login', {
      title: 'Innskráning',
      err: errors,
      data: safeData,
    });
    return;
  }
  try {
    data.hashPass = await users.hash(data.password01);
    await users.db.createUser(data);
  } catch (err) {
    throw new Error(err);
  }
  res.render('thanks', {
    title: 'Þakkir',
  });
}

router.post('/',
  check('userName').isLength({
    min: 1,
  }).withMessage('Notendanafn má ekki vera tómt'),
  check('password').isLength({
    min: 8,
  }).withMessage('Lykilorð verður að vera minst 8 stafir'),

  sanitize('userName').trim().escape(),
  sanitize('password').trim().escape(),
  catchErrors(submit));

router.get('/', catchErrors(page));

module.exports = router;
