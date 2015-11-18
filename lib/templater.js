var fs = require('fs')
var path = require('path')
var handlebars = require('handlebars')

module.exports = {
  load: function loadTemplateFile (templateDirectory, templateName) {
    var templateFile = templateName + '.hbs'
    var filePath = path.join(process.cwd(), templateDirectory, templateFile)
    return fs.readFileSync(filePath, { encoding: 'utf8' })
  },
  compile: function compileEmailContent (templateString, data) {
    var template = handlebars.compile(templateString)
    return template(data)
  },
  extractSubject: function extractSubject (templateString) {
    var subject = templateString.match(/SUBJECT\:\:.*\n/)
    if (subject.length) return subject[0].replace(/SUBJECT\:\:/, '')

    return ''
  },
  extractHtml: function extractHtml (templateString) {
    return templateString.replace(/SUBJECT\:\:.*\n/, '')
  }
}
