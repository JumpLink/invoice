/**
 * OdfController
 *
 * @description :: Server-side logic for managing odfs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');

module.exports = {

  /**
   * `OdfController.get()`
   */
  get: function (req, res) {

    return res.json({
      todo: 'get() is not implemented yet!'
    });
  },


  /**
   * `OdfController.create()`
   */
  create: function (req, res) {
    req.file("WebODF").upload(function (err, files) {
      if (err) {
        sails.log.error(err);
        return res.serverError(err);
      }

      return res.json({
        message: files.length + ' file(s) uploaded successfully!',
        files: files
      });
    });
  },


  /**
   * `OdfController.destroy()`
   */
  destroy: function (req, res) {
    return res.json({
      todo: 'destroy() is not implemented yet!'
    });
  }
};

