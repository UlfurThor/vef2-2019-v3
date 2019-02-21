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
async function page(req, res) {
  console.info('--- page> admin');
  console.info(req.user);

  if (req.isAuthenticated()) {
    // if (req.user.admin) {
    return res.render('admin', {
      title: 'Admin',
      userAuthenticated: req.isAuthenticated(),
      user: req.user,
    });
    // }
    // return res.redirect('/');
  }

  return res.redirect('/login');
}
/**
 * Genarates application page
 * @param {*} req
 * @param {*} res
 */
router.get('/', catchErrors(page));

module.exports = router;
