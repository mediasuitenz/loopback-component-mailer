'use strict'
var merge = require('deepmerge')
var kue = require('kue')
var EventEmitter = require('events').EventEmitter
var templater = require('./lib/templater')
var mail = require('./lib/mail')
var striptags = require('striptags')
var debug = require('debug')('loopback-component-mailer')

module.exports = function (app, options) {
  debug('Setting up mailer Component')

  options = merge({
    namespace: 'mailer',
    email: {
      apiKey: '',
      transport: 'sendgrid',
      from: '',
      subject: '<no-subject>'
    },
    redis: {
      host: '127.0.0.1',
      port: 6379
    },
    templatePath: '/server/mailer/templates/'
  }, options)

  var mailer = app[options.namespace] = new EventEmitter()

  debug('Create email queue')
  var emailQueue = kue.createQueue({
    redis: {
      host: options.redis.host,
      port: options.redis.port
    }
  })

  emailQueue.on('error', function (err) {
    debug('Queue error: ', err.Error)
  })

  emailQueue.process('email', function (job, done) {
    debug('Email from queue is about to be processed')
    sendMail(job.data, function (err, json) {
      if (err) {
        var error = new Error('Error sending mail')
        error.job = job
        error.transportError = err
        mailer.emit('error', error)
        debug('Error sending email with id: %d', job.id)
      } else {
        mailer.emit('success', job)
        debug('Email with id "%d" was successfully sent.', job.id)
      }
      done()
    })
  })

  var sendMail = mail(options.email)

  var createEmailObject = function (templateName, data) {
    debug('Creating email object')
    var template = templater.load(options.templatePath, templateName)
    if (options.email.header) {
      debug('Adding email header')
      template = templater.addHeader(template, options.email.header)
    }
    if (options.email.footer) {
      debug('Adding email footer')
      template = templater.addFooter(template, options.email.footer)
    }
    var emailContent = templater.compile(template, data.msgVariables)
    var subject = templater.extractSubject(emailContent) || options.email.subject
    var htmlContent = templater.extractHtml(emailContent)
    var textContent = striptags(htmlContent)

    debug('Email object will be returned')
    return {
      to: data.to,
      from: data.from || options.email.from,
      subject: subject,
      html: htmlContent,
      text: textContent,
      bcc: data.bcc,
      cc: data.cc,
      replyto: data.replyto
    }
  }

  // send method pushes email to the mail queue, job processing is handlied in
  // emailQueue.process('email', ...
  mailer.send = function (templateName, data, callback) {
    var email = createEmailObject(templateName, data)
    debug('Add email to queue')
    var job = emailQueue.create('email', email).removeOnComplete(true).save(function (err) {
      if (err) {
        debug('Error adding email to queue')
        callback({
          status: err.message,
          jobId: job.id
        }, null)
      } else {
        debug('Email has been added to queue')
        callback(null, {
          status: 'added to queue',
          jobId: job.id
        })
      }
    })
  }
}
