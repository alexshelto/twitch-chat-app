
const tmi = require('tmi.js');




//creating tmi client
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: ['#blah'] //change to your channel 
});

client.connect();


//handling messages
/*
        --PARAMETERS--
channel: String - Channel name
userstate: Object - Userstate object
message: String - Message received
self: Boolean - Message was sent by the client
*/
client.on('message', async (channel, userstate, message, self) => { 
  //dont listen to my own messages
  if (self) return;
  console.log("message recieved");
});
