var sendgrid = require('@sendgrid/mail')

module.exports = function (options) {
  sendgrid.setApiKey(options.apiKey)

  return {
    send: function (data, callback) {
      sendgrid.send(data, callback)
    }
  }
}
