/**
 * app.js
 * Handles connecting tci client and grabbing twitch messages
 * Packages message data and sends to front end to be displayed
 */


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

  // const color = content.color || '#6441a5';

  element.innerHTML = `
  <div class="message-blob">
    <span class="display-name" >${content.displayName}:</span>
    <span class="message">${sanitize(content.message)}</span>
  </div>`;

  messages.appendChild(element); //append the new html element to that div 'messages'
  
  //auto scroll
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  });
}



//Function pulled from https://github.com/tmijs/tmi.js/issues/11
//Credit goes to AlcaDesign, github: https://github.com/AlcaDesign
function formatEmotes(text, emotes) {
  var splitText = text.split('');
  for(var i in emotes) {
      var e = emotes[i];
      for(var j in e) {
          var mote = e[j];
          if(typeof mote == 'string') {
              mote = mote.split('-');
              mote = [parseInt(mote[0]), parseInt(mote[1])];
              var length =  mote[1] - mote[0],
                  empty = Array.apply(null, new Array(length + 1)).map(function() { return '' });
              splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
              splitText.splice(mote[0], 1, '<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0">');
          }
      }
  }
  return splitText.join('');
}


//creating tmi client
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: ['#'] //change to your channel 
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

  const content = {
    id: userstate.id,
    color: userstate['color'],
    displayName: userstate['display-name'],
    message: formatEmotes(message, userstate.emotes),
  };

  displayChatContent(content);
  console.log(content.color);

  //dev debug stuff
  // console.log(`${userstate['display-name']}: ${message}`);
});
