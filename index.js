var merge = require('merge')
var kue = require('kue')
var templater = require('./lib/templater')
var mail = require('./lib/mail')

module.exports = function (app, options) {
  app.mailer = {}

  options = merge({
    email: {
      protocol: 'smtp',
      host: '',
      port: 587,
      account: '',
      password: ''
    },
    redis: {
      host: 'localhost',
      port: '6379'
    },
    templatePath: '/server/mailer/templates/'
  }, options)

  var emails = kue.createQueue({
    redis: {
      host: options.redis.host,
      port: options.redis.port
    }
  })

  mail.setup(app, options.email)

  app.mailer.addToQueue = function (templateName, data) {
    // get template
    var template = templater.load(options.templatePath, templateName)
    // add data
    var emailContent = templater.compile(template, data)
    // send to queue
    emails.create('email', emailContent).save()
  }

  emails.process('email', mail.send)
}
