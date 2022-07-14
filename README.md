# Notifier #
A package for providing various ways of notifying recipients of messages.  Currently supports sms, email, and slack transports.

## Installation ##
This package is not in a repository.  Add this to your module via:
```
npm install --save git+ssh://git@bitbucket.org:newsunroad/notifier.git
```

The usual `npm update` doesn't seem to work for git packages, so you can update the package by just doing another
```
npm install git+ssh://git@bitbucket.org:newsunroad/notifier.git
```

## Concepts ##
Any notification is sent via a transport through a provider.  For example, an SMS message may be sent through AWS SNS or Twilio.  Ideally the client will indicate that an SMS message should be sent to one or more recipients/groups of recipients, and based upon the configuration, the appropriate provider will be selected.  Note that there may be several providers that are capable of sending the message and may be configured as such.  In this case, the system will choose the first one in the configuration list.

A future enhancement may be to provide fault-tolerance by looping through the providers in case the send fails, or to use a round-robin strategy for sending it, or send using all in case its super important.

## Usage ##
You need a configuratione that indicates the credentials and other setup parameters.  A sample config is provided
in the file `sampleConfig.js`.  The typical usage pattern is to first require the module, then initialize it with
the indicated configuration file (or object), and then invoke the `send` method with appropriate parameters, such as:

```
const Notifier = require('notifier')
const notifier = new Notifier('config.js')

notifier.send('email',{text:'this is the contents of the email',
  subject:'some subject',
  from:'me@example.com',
  to:'you@example.com',
  cc:'him@example.com})
```

Sms and Slack channels only support the `text` and `to` parameters.

## Configuration File ##
The sample configuration file should be pretty self-explanatory.  The file indexes each of the available transports, each of which contains an array of specifications.  First, it must specify and array of 1 or more adapters.  Each adapter specifies the **name** which is identifies it as one of the supported adapters, the **provider** which specifies the name of the service that the adapter is for (e.g. "aws" or "twilio"), as well as a **credentials**, which indicates the credentials for the adapter. Each transport specification may also include an options map, which can specify the **defaults** to be used as well as **groups**  or **templates**.

### Groups ###
For a transport (e.g. sms, email, or slack), it specifies easier-to-use names mapping to individuals or groups of individuals.  For example, you can specify a group such as `admin`, which can then contain
the addresses for a number of different users.  For sms, each of those parties will receive a text.  For email. the admin is expanded in
the `to` field.  Does not apply to slack.

### Templates ###
You can also specify default and other templates that specify default values for the various parameters (only for email transport).  For example,
for email you may specify a default template that has the `subject` and `to` fields pre-filled.  To specify a given template, provide it via
the key `template` in the send parameters.

Imagine a template named `connectionError`, configured as:
```
  {
    email: {
      credentials: {...}
      templates: {
        connectionError: {
          subject: 'Connection ERROR!',
          from: 'noreply@example.com',
          to: 'admin@example.com',
          cc: 'ops@example.com'
        }
      }
    }
```

Now, you can send the connection error with
```
notifier.send('email',{
  template:'connectionError',
  text:'There was a database connection error'}
)
```

and the `to`, `from`, and other fields get filled per the template.

### defaults ###
As the name suggests, the defaults specify the default values to use.  For example, if the system supports multiple SMS adapters using both Twilio and AWS SNS, on different systems you may specify different adapters by specifying the **adapter** as a default parameter.  Likewise, the defaults may specify the default group name to send emails or messages to, or the default channel to which you post a slack message.

Note that templates specify some default values but you can also specify these in the defaults section.  In this case, the values in the template will supersede the values in the defaults.
