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
} = require('./dbApplications');
const {
  catchErrors,
} = require('./utils');

const router = express.Router();


router.use(express.urlencoded({
  extended: true,
}));

// ------------------------------------------------------------------------------------------
/**
 * Genarates application page
 * @param {*} req
 * @param {*} res
 */
async function page(req, res) {
  console.info('--- page> index');

  // `title` verður aðgengilegt sem breyta í template
  res.render('apply', {
    title: 'Umsókn',
    userAuthenticated: req.isAuthenticated(),
    user: req.user,
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
  console.info('--- page> submit');
  const data = req.body;

  const errors = validationResult(req);
  // console.log(data);
  if (!errors.isEmpty()) {
    const err = {};
    err.msgList = errors.array().map(i => i.msg);
    for (let j = 0; j < errors.array().length; j += 1) {
      err[errors.array()[j].param] = true;
    }
    const safeData = data;
    safeData.name = xss(data.name);
    safeData.email = xss(data.email);
    safeData.phone = xss(data.phone);
    safeData.comment = xss(data.comment);
    safeData.jobTitle = xss(data.jobTitle);

    res.render('apply', {
      title: 'Umsókn',
      err,
      data: safeData,
      userAuthenticated: req.isAuthenticated(),
      user: req.user,
    });
    return;
  }
  try {
    await createApplication(data);
  } catch (err) {
    throw new Error(err);
  }
  res.render('thanks', {
    title: 'Þakkir',
    userAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
}

router.post('/',
  check('name').isLength({ min: 1 }).withMessage('Name must not be empty'),
  check('email').isLength({ min: 1 }).withMessage('Email must not be empty'),
  check('email').isEmail().withMessage('Email must be formated as an email'),
  check('phone').isLength({
    min: 1,
  }).withMessage('Phone must not be empty'),
  check('phone')
    .matches(/^([0-9]){3}[- ]?([0-9]){4}$/)
    .withMessage('Phone number must be 7 characters long (posible dash after 3rd char)'),
  check('comment').isLength({ min: 100 }).withMessage('Comment must be at least 100 character long'),
  check('jobTitle').isIn(['programer', 'designer', 'admin']).withMessage('Job title not valid'),

  sanitize('name').trim().escape(),
  sanitize('email').normalizeEmail(),
  sanitize('phone').blacklist('- ').toInt(),
  sanitize('comment').trim().escape(),
  sanitize('jobTitle').trim().escape(),
  catchErrors(submit));

router.get('/', catchErrors(page));

module.exports = router;
