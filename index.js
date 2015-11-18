var merge = require('deepmerge')
var kue = require('kue')
var templater = require('./lib/templater')
var mail = require('./lib/mail')
var striptags = require('striptags')

module.exports = function (app, options) {
  app.mailer = {}

  options = merge({
    email: {
      apiKey: '',
      transport: 'sendgrid',
      from: ''
    },
    redis: {
      host: '127.0.0.1',
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

  var sendMail = mail(options.email)

  var createEmailObject = function (templateName, data) {
    var template = templater.load(options.templatePath, templateName)
    var emailContent = templater.compile(template, data.msgVariables)
    var subject = templater.extractSubject(emailContent)
    var htmlContent = templater.extractHtml(emailContent)
    var textContent = striptags(htmlContent)

    return {
      to: data.to,
      from: options.email.from,
      subject: subject,
      html: htmlContent,
      text: textContent
    }
  }

  app.mailer.addToQueue = function (templateName, data, callback) {
    var email = createEmailObject(templateName, data)

    emails.create('email', email).save(function (err) {
      if (err) {
        callback({status: err.message})
      } else {
        callback({status: 'added to queue'})
      }
    })

    emails.process('email', function (item, callback) {
      sendMail(item.data, callback)
    })
  }
}
