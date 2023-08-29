var nodemailer = require('nodemailer');
var debug = require('debug')('loopback-component-mailer');

module.exports = function (options) {
    const transporter = nodemailer.createTransport({
        host: options.host || 'localhost',
        port: options.port || 1025,
    });

    return {
        send: async function (data, callback) {
            await transporter.sendMail(data, (error) => {
                if (error) {
                    debug('Mailhog transport: an error occurred: ', error)
                    return error
                } else {
                    debug('Mailhog transport: mail was sent')
                    callback()
                }
            });
        }
    }
}
