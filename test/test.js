/* global beforeEach, describe, it */
var loopback = require('loopback')
var expect = require('chai').expect
var component = require('../')
var app

describe('mailer', function () {
  beforeEach(function () {
    app = loopback()
    app.set('legacyExplorer', false)
    app.use(loopback.rest())
  })

  describe('when using defaults', function () {
    it('should do something', function (done) {
      component(app, {})
      expect('feature').to.be.ok
      done()
    })
  })
})
