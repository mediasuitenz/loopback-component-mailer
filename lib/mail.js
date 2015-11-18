module.exports = function (options) {
  var transport

  switch (options.transport) {
    case 'sendgrid':
      transport = require('./transports/sendgrid')(options)
      break
    default:
      throw new Error('Transport type: ' + options.transport + ' is either invalid or was not defined')
  }

  return function sendMail (data, callback) {
    transport.send(data, function (err, info) {
      if (err) return err
      callback(info)
    })
  }
}
