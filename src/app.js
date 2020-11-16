
const tmi = require('tmi.js');
const DOMPurify = require('dompurify');
//sanitize text so we dont get any XXS issues 
function sanitize(text) {
  return DOMPurify.sanitize(text, { FORBID_ATTR: [ 'onerror', 'onload' ], FORBID_TAGS: [ 'script', 'iframe' ] });
}


// function getMessageAndEmotes(userstate, message) {
//   let messageStr = '';
//   //if there is emotes in the message
//   if(userstate.emotes) {
//     const emoteIDs = Object.keys(userstate.emotes);  //creates an array object of all the unique emote ids
//     console.log(emoteIDs);
//   }
//   return messageStr || message
// }



function displayChatContent(content) {
  const element = document.createElement('div');  //creating a new html element 
  element.classList.add('message');               //add a class name to element for css styling

  element.innerHTML = `
    <span class="display-name" >${content.displayName}:</span>
    <span class="message">${sanitize(content.message)}</span>`;

  messages.appendChild(element); //append the new html element to that div 'messages'
  
  //auto scroll
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  });
}





//creating tmi client
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: ['#shroud'] //change to your channel 
});
//connecting client to twitch chat channel
client.connect();





/*
        handling messages

        --PARAMETERS--
channel: String - Channel name
userstate: Object - Userstate object
message: String - Message received
self: Boolean - Message was sent by the client
*/
client.on('message', async (channel, userstate, message, self) => { 
  //dont listen to my own messages
  if (self) return;

  const content = {
    id: userstate.id,
    displayName: userstate['display-name'],
    message: message,
  };

  displayChatContent(content);

  //dev debug stuff
  // console.log(`${userstate['display-name']}: ${message}`);
});
