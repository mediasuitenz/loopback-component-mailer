var merge = require('merge')
var kue = require('kue')
var templater = require('./lib/templater')

module.exports = function (app, options) {
  app.mailer = {}

  options = merge({
    redisHost: 'localhost',
    redisPort: '6379',
    templatePath: '/server/mailer/templates/'
  }, options)

  var emails = kue.createQueue({
    redis: {
      host: options.redisHost,
      port: options.redisPort
    }
  })

  app.mailer.addToQueue = function (templateName, data) {
    // get template
    var template = templater.load(options.templatePath, templateName)
    // add data
    var emailContent = templater.compile(template, data)
    // send to queue
    emails.create('email', emailContent).save()
  }

  emails.process('email', function (email, done) {
    console.log('processed', email.id)
    done()
  })
}
