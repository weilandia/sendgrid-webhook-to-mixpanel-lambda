process.env.MIXPANEL_TOKEN = "test_token";
const expect = require('chai').expect;
const sinon = require('sinon');

const lambdaLocal = require('lambda-local');
const mpTrackSendGrid = require('../mpTrackSendGrid');

let sendGridPayload = {
  body: JSON.stringify([
    {
      "distinct_id": 123,
      "organization_id": 32,
      "organization_size": "enterprise",
      "user_email": "example@test.com",
      "timestamp": 1508542936,
      "smtp-id": "<14c5d75ce93.dfd.64b469@ismtpd-555>",
      "event": "processed",
      "category": "cat facts",
      "sg_event_id": "M0KaRo92wGpS1clK5ox6gg==",
      "sg_message_id": "14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0"
    },
    {
      "distinct_id": 456,
      "organization_id": 122,
      "organization_size": "smb",
      "user_email": "example_2@test.com",
      "timestamp": 1508542936,
      "smtp-id": "<14c5d75ce93.dfd.64b469@ismtpd-555>",
      "event": "deferred",
      "category": "cat facts",
      "sg_event_id": "W5aNQjYjn5JzWnrfQ6tGuw==",
      "sg_message_id": "14c5d75ce93.dfd.64b469.filter0001.16648.5515E0B88.0",
      "response": "400 try again later",
      "attempt": "5"
    }
  ])
};

let res;
let err;
let mixpanelSpy;

before(function(cb) {
  mixpanelSpy = sinon.spy(mpTrackSendGrid.mixpanel, 'track');
  lambdaLocal.execute({
    event: sendGridPayload,
    lambdaFunc: mpTrackSendGrid
  }).then(function(_res) {
    res = _res;
  }).catch(function(_err) {
    err = _err;
  });

  cb();
});

describe('mpTrackSendGrid', function() {
  it('returns a 200 status', function() {
    expect(res.statusCode).to.equal(200);
  });

  it('counts tracked events', function() {
    expect(res.eventsTracked).to.equal(2);
  });

  it('asks mixpanel to track the right number of events', function() {
    expect(mixpanelSpy.callCount).to.equal(res.eventsTracked);
  });

  it('asks mixpanel to track the right data', function() {
    let event_1 = JSON.parse(sendGridPayload.body)[0];
    let args_1 = mixpanelSpy.firstCall.args;
    let props_1 = args_1[1];

    expect(args_1[0]).to.equal("SendGrid: " + event_1.event);
    expect(props_1.category).to.equal(event_1.category);
    expect(props_1.sg_event_id).to.equal(event_1.sg_event_id);
    expect(props_1.sg_message_id).to.equal(event_1.sg_message_id);

    let event_2 = JSON.parse(sendGridPayload.body)[1];
    let args_2 = mixpanelSpy.secondCall.args;
    let props_2 = args_2[1];

    expect(args_2[0]).to.equal("SendGrid: " + event_2.event);
    expect(props_2.category).to.equal(event_2.category);
    expect(props_2.sg_event_id).to.equal(event_2.sg_event_id);
    expect(props_2.sg_message_id).to.equal(event_2.sg_message_id);
  });
});
