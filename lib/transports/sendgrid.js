module.exports = function (options) {
  var sendgrid = require('sendgrid')(options.apiKey)

  return {
    send: function (data, callback) {
      sendgrid.send(data, callback)
    }
  }
}
