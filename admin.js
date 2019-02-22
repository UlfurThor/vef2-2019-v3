const express = require('express');
const xss = require('xss');
const {
  catchErrors,
} = require('./utils');

const users = require('./users');

const router = express.Router();


router.use(express.urlencoded({
  extended: true,
}));

/**
 * Makes a HTML safe version of user list
 * @param {data to "safe"} data
 */
function safeDataHelper(data) {
  const safeData = data;
  for (let j = 0; j < data.length; j += 1) {
    safeData[j] = data[j];
    safeData[j].username = xss(data[j].username);
    safeData[j].name = xss(data[j].name);
    safeData[j].email = xss(data[j].email);
  }
  return safeData;
}

/**
 * Genarates the HTML to display application list
 * @param {input data} safeData
 */
function htmlHelper(safeData, admin) {
  const html = [];

  for (let j = 0; j < safeData.length; j += 1) {
    let innerHTML = '';

    innerHTML = `${innerHTML} <tr>`;
    innerHTML = `${innerHTML}   <td><input type="checkbox" name="adminList[]" value="${safeData[j].id}"`;
    if (!admin) {
      innerHTML = `${innerHTML} disabled readonly`;
    }
    if (safeData[j].admin) {
      innerHTML = `${innerHTML} checked`;
    }
    innerHTML = `${innerHTML} ></td>`;
    innerHTML = `${innerHTML}   <td>${safeData[j].username}</td>`;
    innerHTML = `${innerHTML}   <td>${safeData[j].name}</td>`;
    innerHTML = `${innerHTML}   <td>${safeData[j].email}</td>`;
    innerHTML = `${innerHTML} </tr>`;
    html[j] = innerHTML;
  }
  return `
    <div class = "users__container">
      <form id="adminUpdate" action="/admin" method="post">
        <div class="table__container">
          <table>
            <thead>
              <tr>
                <th>Stjórnandi</th>
                <th>Notendanafn</th>
                <th>Nafn</th>
                <th>Netfang</th>
              </tr>
            </thead>
            <tbody>
              ${html.join(' ')}
            </tbody>
          </table>
        </div>
        <button>Upfæra stjórnendur</button>
      </form>
    </div>`;
}

// ------------------------------------------------------------------------------------------
async function page(req, res) {
  console.info('--- page> admin --get');

  let data;
  try {
    data = await users.db.readUsers();
  } catch (err) {
    throw new Error(err);
  }
  const safeData = safeDataHelper(data);

  const html = htmlHelper(safeData, req.user.admin);
  return res.render('admin', {
    title: 'Admin',
    formatedHTML: html,
    userAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
}

async function processApplication(req, res) {
  console.info('--- page> admin --post');
  const data = req.body;

  if (req.user.admin) {
    let adminList = [];
    if (data.adminList !== undefined) {
      adminList = data.adminList.map(x => parseInt(x, 10));
    }
    try {
      // await updateApplications(id);
      await users.db.updateUsers(adminList);
    } catch (err) {
      throw new Error(err);
    }
  } else {
    console.error('Non admin tried to update admin status');
  }
  // 500 ms wait before returning to alow the db to do its thing
  setTimeout(() => {
    res.redirect('/admin');
  }, 1000);
}


/**
 * Genarates application page
 * @param {*} req
 * @param {*} res
 */
router.get('/', catchErrors(page));
router.post('/', catchErrors(processApplication));

module.exports = router;
