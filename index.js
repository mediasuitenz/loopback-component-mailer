var merge = require('merge')

module.exports = function (app, options) {
  app.mailer = {}

  options = merge({
    redisHost: 'localhost',
    templatePath: '/server/mailer/templates/'
  }, options)

  app.mailer.addToQueue = function (template, data) {
    // get template, add data, send to queue
  }
}
