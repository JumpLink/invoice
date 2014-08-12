/**
 * ViewController
 *
 * @description :: Server-side logic for managing views
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /*
   * single-page application https://en.wikipedia.org/wiki/Single-page_application
   */
	singlePage: function(req, res, next) {
    res.view('index');
  },

  /*
   * legacy html page to allow browser to auto-fill e-mail and password
   */
  signin: function(req, res, next) {
    res.view('signin', { flash: req.session.flash });
  }
};

