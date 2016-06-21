/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back prayer for paper)"
 
 
 */

'use strict';

var AlexaSkill = require("./AlexaSkill");
var prayerscard = require("./prayerscard.js");
var prayers = require("./prayers.js");

var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * PrayerHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var PrayerHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
PrayerHelper.prototype = Object.create(AlexaSkill.prototype);
PrayerHelper.prototype.constructor = PrayerHelper;

PrayerHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to Prayer Helper. Say the name of the prayer you would like me to say. You can ask me to say a prayer like Our Father or Hail Mary ... Now, which prayer would you like me to say?.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me. For a list of prayers say: list of prayers";
    response.ask(speechText, repromptText);
};

PrayerHelper.prototype.intentHandlers = {
    "PrayerIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "" + itemName,
            prayer = prayers[itemName],
            prayercard = prayerscard    [itemName],
            speechOutput, 
            repromptOutput;
        if (prayer) {
            speechOutput = {
                speech: prayer,
                type: AlexaSkill.speechOutputType.SSML
            };
            response.tellWithCard(speechOutput, cardTitle, prayercard);
        } else {
            var speech;
            if (itemName) {
                speech = "<speak>I'm sorry, I currently do not know the prayer " + itemName + ". Which other prayer would you like me to say?</speak>";
            } else {
                speech = "<speak>I'm sorry, I didn't hear the name of the prayer. Please say the name of the prayer you would lime me to say?</speak>";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.SSML
            };
            repromptOutput = {
                speech: "<speak>Which other prayer would you like me to say?</speak>",
                type: AlexaSkill.speechOutputType.SSML
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "Say the name of the prayer you would like me to say. You can ask me to say a prayer like Our Father or Hail Mary... Now, which prayer would you like me to say?";
        var repromptText = "You can say things like, pray our father or pray a hail mary, ... Now, which prayer would you like me to say?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var prayerHelper = new PrayerHelper();
    prayerHelper.execute(event, context);
};
