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
    console.log("create file");
    req.file("WebODF").upload(function (err, files) {
      console.log("upload files");
      console.log(files);
      if (err) {
        return res.serverError(err);
        console.log(err);
      }

      return res.json({
        message: files.length + ' file(s) uploaded successfully!',
        files: files
      });
    });

    // if (req.xhr) {
    //   console.log("Yup, it's AJAX alright.");
    // }
    // console.log(req);
    // req.pipe(fs.createWriteStream(__dirname + "/test.odt"));

    // req.on('data', function(data) {
    //   console.log(data);
    // });

    // return res.json({
    //   todo: 'create() is not implemented yet!'
    // });
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

