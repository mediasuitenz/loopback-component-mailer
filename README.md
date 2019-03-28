# loopback-component-mailer

This component adds a mailer to loopback. Templating is done with handlebars. The queue is handled by kue/redis. The sole transport is currently sendgrid, but the module is built to be easily extendable.

# Requirements

Redis >= 2.6.12

# Usage

**Installation**

1. Install in you loopback project:

  `npm install --save loopback-component-mailer`

2. Create a component-config.json file in your server folder (if you don't already have one)

3. Configure options inside `component-config.json`. *(see configuration section)*

  ```json
  {
    "loopback-component-mailer": {
      "{option}": "{value}"
    }
  }
  ```

4. Create a folder for storing templates.

  The default location is `/server/mailer/templates`. This can be set in `component-config.json` (see below)

**Configuration**

Options:

- `templatePath`

  [String] : The location of of the email templates relative to the project root. *(default: '/server/mailer/templates/')*

- `namespace`

  [String] : The name used for attaching to the loopback app object. *(default: 'mailer')*

- `redis`

  [Object] : Config for connection to redis server. *(default: { host: 127.0.0.1, port: 6379 })*

- `email`

  [Object] : Config email transport, currently only sendgrid is supported. *(default: {
    apiKey: '',
    transport: 'sendgrid',
    from: '',
    subject: '<no-subject>'
  })*

**Templates**

Mail templates are in handlebars format. The subject line for the email should be the first line in the template file and is identified using the following format:
```
SUBJECT::Your Email Subject
```
You can also use handlebars in the subject line, for example:
```
SUBJECT::Your Email regarding {{topic}}
```
Template files should have the extension `.hbs`

**HTML Header/Footer**

A static HTML header and/or footer can be added to HTML emails. Specify the path to the header/footer file(s) in the component config.

Example:
```json
{
  "loopback-component-mailer": {
    "email": {
      "apiKey": "<yourApiKey>",
      "header": "/server/mailer/templates/header.html",
      "footer": "/server/mailer/templates/footer.html"
    }
  }
}
```

**Sending mail from Loopback**

When using the default namespace `mailer`, you can add to the mail queue with the following:
```js
  app.mailer.send(templateName, emailData, callback)
```
Arguments
- `templateName`:[string] the name of your email template file
- `emailData`: [object] example:
```js
  {
    to: <recipient@domain.com>, // can be an array of recipients
    from: <sender@domain.com>, // only required if different from the default set in component-config.json
    bcc: <bcc@domain.com>, // not required, can be an array of recipients
    cc: <cc@domain.com>, // not required, can be an array of recipients
    replyto: <replyto@domain.com>, // not required
    msgVariables: {
      subjectVariable: 'New Subject',
      to: 'Myself',
      text: 'Integration Test'
    }
  }
```
  - `to`: the email address of the recipient
  - `from`: the email address of the sender (if different from the default set in component-config.json)
  - `bcc`: the email address(es) of the blind carbon copy recipient(s)
  - `cc`: the email address(es) of the carbon copy recipient(s)
  - `replyto`: the email address to set for reply-to
  - `msgVariables`: variables for use in the template file
  - `callback`: [function] this function will be called when the mail has been added to the queue

