const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors())

app.get('/', (req, res) => {

      res.send('Hello from our server!')
})

app.post("/webhook", (req, res) => {
    let body = req.body;
  
    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, { depth: null });
      
  // Send a 200 OK response if this is a page webhook

  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    body.entry.forEach(function(entry){
      let webhook_event = entry.messaging[0]
      console.log(webhook_event)
    })

    res.status(200).send("EVENT_RECEIVED");

    // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}); 
app.get("/webhooks", (req, res) => {
  var verify_token = process.env.VERIFY_TOKEN
  console.log('verify token ',verify_token)
  // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === "subscribe" && token === verify_token) {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });


app.listen(8080, () => {
      console.log('server listening on port 8080')
})