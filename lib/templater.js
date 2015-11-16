var fs = require('fs')
var path = require('path')
var handlebars = require('handlebars')

module.exports = {
  load: function loadTemplateFile (templateDirectory, templateName) {
    var templateFile = templateName + '.hbs'
    var filePath = path.join(__dirname, '../', templateDirectory, templateFile)
    return fs.readFileSync(filePath, { encoding: 'utf8' })
  },
  compile: function compileEmailContent (templateString, data) {
    var template = handlebars.compile(templateString)
    return template(data)
  }
}
