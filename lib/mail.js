var DataSource = require('loopback-datasource-juggler').DataSource

module.exports = {
  send: function (email, done) {
    console.log('processed', email.id)
    done()
  },
  setup: function (app, settings) {
    var dataSource = new DataSource('emailDataSource', {
      'connector': 'mail',
      'transports': [{
        'type': settings.protocol,
        'host': settings.host,
        'secure': false,
        'port': settings.port,
        'tls': {
          'rejectUnauthorized': false
        },
        'auth': {
          'user': settings.account,
          'pass': settings.password
        }
      }]
    })
  }
}
