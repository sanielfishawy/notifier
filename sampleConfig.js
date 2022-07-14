module.exports = {
  email: {
    adapters: [
      {
        name: 'awsMail',
        provider: 'aws',
        config: {
          credentials: {
            apiKey: 'xxx',
            accessKeyId: 'xxx',
            secretAccessKey: 'xxx',
            region: 'xxx',
          },
        },
      },
      {
        name: 'sendgridMail',
        provider: 'sendgrid',
        credentials: {
          apiKey: 'xxxx'
        },
      }
    ],
    options: {
      templates: [
        {
          name: 'generic',
          to: 'admin@example.com',
          subject: 'A generic email that may end up in your spam folder'
        },
        {
          name: 'events',
          to: 'admin@example.com',
          subject: 'Event Notification'
        },
        {
          name: 'ops-issue',
          to: 'ops@example.com',
          subject: 'There was a meltdown'
        }
      ],
      groups: {
        admin: ['joe@example.com','bob@example.com'],
        ops: ['jill@example.com']
      },
      defaults: {
        adapter: 'sendgridMail',
        from: 'noreply@admin.com',
        template: 'generic'
      }
    },
  },

  sms: {
    adapters: [
      {
        name: 'twilioSms',
        provider: 'twilio',
        credentials: {
          accountSid: 'xxxx',
          authToken: 'xxxx',
          phoneNumber: '+1231231234'
        },
      },
      {
        name: 'awsText',
        provider: 'aws',
        credentials: {
          accessKeyId: 'xxx',
          secretAccessKey: 'xxx',
          region: 'xxxx',
        },
      },
    ],
    options: {
      defaults: {
        adapter: 'awsText',
        to: ['admin'],
      },
      groups: {
        admin: ['+11231234']
      }
    }
  },
  slack: {
    adapters: [
      {
        name: 'slackApp',
        provider: 'slack',
        credentials: {
          token: 'xxxxx'
        }
      },
    ],
    options: {
      defaults: {
        to: 'general'
      }
    }
  }
}