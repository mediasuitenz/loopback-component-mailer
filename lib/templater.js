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
  },
  addHeader: function addHeader (htmlContent, headerFile) {
    var pathToHeaderFile = path.join(process.cwd(), headerFile)
    var headerContent = fs.readFileSync(pathToHeaderFile)
    return headerContent + htmlContent
  },
  addFooter: function addFooter (htmlContent, footerFile) {
    var pathToFooterFile = path.join(process.cwd(), footerFile)
    var footerContent = fs.readFileSync(pathToFooterFile)
    return htmlContent + footerContent
  }
}
