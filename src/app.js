
const tmi = require('tmi.js');




function getMessageAndEmotes(userstate, message) {
  let messageStr = '';
  //if there is emotes in the message
  if(userstate.emotes) {
    const emoteIDs = Object.keys(userstate.emotes);  //creates an array object of all the unique emote ids
    console.log(emoteIDs);
  }
  return messageStr || message
}



//creating tmi client
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: ['#'] //change to your channel 
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

  const event = {
    id: userstate.id,
    displayName: userstate['display-name'],
    // message: getMessageAndEmotes(userstate, message)
  };


  //dev debug stuff
  console.log("message recieved");
  console.log(userstate['display-name']);
  console.log(message);

  getMessageAndEmotes(userstate, message);

});
