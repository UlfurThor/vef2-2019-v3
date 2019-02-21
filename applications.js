const express = require('express');
const xss = require('xss');
const {
  readApplications,
  updateApplications,
  deleteApplications,
} = require('./dbApplications');
const {
  catchErrors,
} = require('./utils');

const router = express.Router();

router.use(express.urlencoded({
  extended: true,
}));

/**
 * Makes a HTML safe version of application list
 * @param {data to "safe"} data
 */
function safeDataHelper(data) {
  const safeData = data;
  for (let j = 0; j < data.length; j += 1) {
    safeData[j] = data[j];
    safeData[j].name = xss(data[j].name);
    safeData[j].email = xss(data[j].email);
    safeData[j].phone = xss(data[j].phone);
    safeData[j].comment = xss(data[j].comment);
  }
  return safeData;
}

/**
 * Genarates the HTML to display application list
 * @param {input data} safeData
 */
function htmlHelper(safeData) {
  const html = [];

  for (let j = 0; j < safeData.length; j += 1) {
    let innerHTML = '';
    innerHTML = `${innerHTML} <div class="content">`;
    innerHTML = `${innerHTML}   <h3 class="name">${safeData[j].name}</h3>`;
    innerHTML = `${innerHTML}   <p class="email"><a href="mailto:${safeData[j].email}">${safeData[j].email}</a></p>`;
    innerHTML = `${innerHTML}   <p class="phone">Sími: ${safeData[j].phone}</p>`;
    innerHTML = `${innerHTML}   <p class="time_sent">Umsókn send: ${safeData[j].created}</p>`;
    innerHTML = `${innerHTML}   </br>`;
    innerHTML = `${innerHTML}   <p class="comment">${safeData[j].comment}</p>`;
    innerHTML = `${innerHTML}   <div class = "button_flex">`;
    if (safeData[j].processed) {
      innerHTML = `${innerHTML}   <span>✓ Umsókn unnin: ${safeData[j].updated}</span>`;
    } else {
      innerHTML = `${innerHTML}   <form id="processAplication" action="/applications/process" method="post">`;
      innerHTML = `${innerHTML}   <input type="hidden" name="applicationID" value="${safeData[j].id}">`;
      innerHTML = `${innerHTML}   <button> Vinna umsókn </button>`;
      innerHTML = `${innerHTML}   </form>`;
    }
    innerHTML = `${innerHTML}   <form id="deleteAplication" action="/applications/delete" method="post">`;
    innerHTML = `${innerHTML}   <input type="hidden" name="applicationID" value="${safeData[j].id}">`;
    innerHTML = `${innerHTML}     <button> Eyða umsókn </button>`;
    innerHTML = `${innerHTML}   </form>`;
    innerHTML = `${innerHTML}   </div>`;
    innerHTML = `${innerHTML} </div>`;

    html[j] = innerHTML;
  }

  return `<div class = "content_container"> ${html.join(' ')} </div>`;
}

/**
 * Genarates page that shows list of applications
 * @param {*} req
 * @param {*} res
 */
async function page(req, res) {
  console.info('--- page> applications');

  let data;
  try {
    data = await readApplications();
  } catch (err) {
    throw new Error(err);
  }

  const safeData = safeDataHelper(data);

  const html = htmlHelper(safeData);

  res.render('applications', {
    title: 'Umsóknir',
    formatedHTML: html,
    userAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
}

/**
 * Handles seting application to processed, before returning the base list page
 * @param {*} req
 * @param {*} res
 */
async function processApplication(req, res) {
  console.info('--- page> process');
  const id = req.body.applicationID;

  try {
    await updateApplications(id);
  } catch (err) {
    throw new Error(err);
  }

  res.redirect('/applications');
}

/**
 * Handles deleting a application, before returning the base list page
 * @param {*} req
 * @param {*} res
 */
async function deleteApplication(req, res) {
  console.info('--- page> delete');
  const id = req.body.applicationID;

  try {
    await deleteApplications(id);
  } catch (err) {
    throw new Error(err);
  }

  res.redirect('/applications');
}


router.get('/', catchErrors(page));
router.post('/process', catchErrors(processApplication));
router.post('/delete', catchErrors(deleteApplication));

module.exports = router;
