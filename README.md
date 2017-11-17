# SendGrid Event Webhook to Mixpanel Lambda Function

A simple lambda function that can be used to transfer SendGrid event data to Mixpanel pings.

## Getting Started

1. To get started, you'll need the [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed. You'll also need your environment configured with [AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

2. Recommended: Map relevant Mixpanel characteristics to [SendGrid SMTP API unique_args](https://sendgrid.com/docs/API_Reference/SMTP_API/unique_arguments.html) for the emails you are sending through SendGrid.

3. Add the MIXPANEL_TOKEN env var for each environment to `serverless.env.yml`.

``` yml
  dev:
    MIXPANEL_TOKEN: "DEV TOKEN"
  staging:
    MIXPANEL_TOKEN: "STAGING TOKEN"
  prod:
    MIXPANEL_TOKEN: "PROD TOKEN"
```

4. Deploy

``` sh
  sls deploy --stage prod
```

5. [Setup the SendGrid Event Webhook](https://sendgrid.com/docs/API_Reference/Webhooks/event.html) with the lambda endpoint.

```
  HTTP POST URL

  https://EXAMPLE.execute-api.us-east-1.amazonaws.com/dev/mixpanel_sendgrid_events
```

6. 🎉 SendGrid event data is in Mixpanel and I don't have to run the webhook through our app!
