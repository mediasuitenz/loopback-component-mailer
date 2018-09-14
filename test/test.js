/* global beforeEach, describe, it */
var loopback = require('loopback')
var expect = require('chai').expect
var component = require('../')
var templater = require('../lib/templater')
var mail = require('../lib/mail')
var nock = require('nock')
var app

describe('templater', function () {
  var templatePath = 'test/templates/'
  var templateName = 'test-email'

  nock('https://api.sendgrid.com')
    .post('/v3/mail/send')
    .reply(function (uri, reqBody) {
      if (!this.req.headers.authorization) {
        return [401, {errors: [{message: 'Permission denied, wrong credentials'}]}]
      }
      return [202, {}]
    })

  describe('loading a template', function () {
    it('should return a template string', function (done) {
      var templateString = templater.load(templatePath, templateName)
      expect(templateString).to.be.a('string')
      expect(templateString).to.equal('Email for: {{to}}, with Content: {{text}}.\n')
      done()
    })
  })

  describe('compiling a template', function () {
    it('should return compiled text', function (done) {
      var data = {
        to: 'test recipient',
        text: 'test email text'
      }
      var expected = 'Email for: ' + data.to + ', with Content: ' + data.text + '.\n'
      var template = templater.load(templatePath, templateName)
      var emailContent = templater.compile(template, data)
      expect(emailContent).to.be.a('string')
      expect(emailContent).to.equal(expected)
      done()
    })
  })

  describe('extracting the subject line', function () {
    it('should return the subject from the template', function (done) {
      var templateString = templater.load(templatePath, 'test-email-with-subject')
      var compiledString = templater.compile(templateString, {subjectVariable: 'Subjects'})
      var subject = templater.extractSubject(compiledString)
      var expected = 'Test Subject: Subjects\n'
      expect(subject).to.equal(expected)
      done()
    })
  })
})

describe('mailer', function () {
  describe('calling send', function () {
    it('should send mail', function (done) {
      var settings = {
        apiKey: 'test',
        transport: 'sendgrid'
      }
      var sendMail = mail(settings)
      sendMail({
        to: 'recipient',
        from: 'sender',
        subject: 'Greet the World',
        text: 'Hello World',
        html: '<h1>Hello World</h1>'
      }, function (err, response) {
        if (err) return done(err)

        expect(response[0].toJSON().statusCode).to.equal(202)
        done()
      })
    })
  })
})

describe('Integration test', function () {
  beforeEach(function () {
    app = loopback()
    app.set('legacyExplorer', false)
    app.use(loopback.rest())
  })

  var templateName = 'test-email-with-subject'
  var data = {
    to: process.env.EMAIL_TO,
    msgVariables: {
      subjectVariable: 'New Subject',
      to: 'Myself',
      text: 'Integration Test'
    }
  }

  describe('adding to the queue', function () {
    it('should give feedback', function (done) {
      component(app, {
        email: {
          transport: 'sendgrid',
          apiKey: process.env.SENDGRID_APIKEY,
          from: process.env.EMAIL_FROM
        },
        templatePath: 'test/templates/'
      })
      app.mailer.send(templateName, data, function (err, result) {
        if (err) return done(err)

        expect(result).to.be.an('object')
        expect(result.status).to.equal('added to queue')
        done()
      })
    })
  })
})
