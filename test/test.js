/* global beforeEach, describe, it */
var loopback = require('loopback')
var expect = require('chai').expect
var component = require('../')
var templater = require('../lib/templater')
var app

describe('templater', function () {
  var templatePath = 'test/templates/'
  var templateName = 'test-email'

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
})

describe('mailer', function () {
  beforeEach(function () {
    app = loopback()
    app.set('legacyExplorer', false)
    app.use(loopback.rest())
  })
  var templateName = 'test-email'
  var data = {
    to: 'test recipient',
    text: 'test email text'
  }

  describe('when using defaults', function () {
    it('should do something', function (done) {
      component(app, {
        templatePath: 'test/templates/'
      })
      app.mailer.addToQueue(templateName, data)
      expect('feature').to.be.ok
      done()
    })
  })
})
