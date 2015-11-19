var fs = require('fs')
var path = require('path')
var handlebars = require('handlebars')

module.exports = {
  load: function loadTemplateFile (templateDirectory, templateName) {
    var fileName = templateName.match(/\.hbs$/) ? templateName : templateName + '.hbs'
    var filePath = path.join(process.cwd(), templateDirectory, fileName)
    return fs.readFileSync(filePath, { encoding: 'utf8' })
  },
  compile: function compileEmailContent (templateString, data) {
    var template = handlebars.compile(templateString)
    return template(data)
  },
  extractSubject: function extractSubject (templateString) {
    var subject = templateString.match(/SUBJECT\:\:.*\n/)
    if (subject) return subject[0].replace(/SUBJECT\:\:/, '')

    return null
  },
  extractHtml: function extractHtml (templateString) {
    return templateString.replace(/SUBJECT\:\:.*\n/, '')
  }
}
