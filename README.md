# loopback-component-mailer

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
