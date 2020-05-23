// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const dotenv = require('dotenv');
dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// All the room in the world for your code


http.createServer((request, response) => {
  console.log(request.body);
  response.end(request.body);
}).listen("https://stormy-beach-37878.herokuapp.com/slack/events")
// Make a note of the channel
let conversationId = "";

// mkae a note of the team ID for data saving + retrieval
let teamId = "";

// Find conversation ID using the conversations.list method
async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN
    });

    for (var channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        break;
      }
    }
  } catch (error) {
    console.log("DIDNT FIND SHIT");
    console.error(error);
  }
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
app.event("message", async ({ event, context }) => {
  try {
    //console.log(event);
    teamId = event.team;
    const sourceChannel = event.channel;
    await findConversation("health-check");
    if (conversationId == sourceChannel) {
      const userResponse = event.text;
      if (await parseFloat(userResponse)) {
        const temperature = parseFloat(userResponse);
        if (temperature >= 37.5) {
          publishMessage(
            conversationId,
            "It looks like you've got a fever! It is highly advised that you rest for the day."
          );
        } else {
          publishMessage(conversationId, "Got it! Thanks!");
        }
        //console.log(parseFloat(userResponse));
      } else {
        publishMessage(conversationId, "Sorry. Dunno what that means!");
      }
    }
  } catch (error) {
    console.error(error);
  }
});
// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text
      //      post_at: 1590075290,
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    //if successful, schedule tomorrow's messages.
    console.log(result);
  } catch (error) {
    console.log("EEEEEEEEEERORO");
    console.error(error);
  }
}

app.event("url_verification", async ({ event, context }) => {
  try {
    console.log(event);
  } catch (error) {
    console.error(error);
  }
  return 200;
});
