const { renderLogin }      = require('./login');
const { renderRegister }   = require('./register');
const { renderDashboard }  = require('./dashboard');
const { renderAdmin }      = require('./admin');
const { renderProfile }    = require('./profile');

module.exports = {
  renderLogin,
  renderRegister,
  renderDashboard,
  renderAdmin,
  renderProfile
};
