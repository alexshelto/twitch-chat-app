/**
 * app.js
 * Handles connecting tci client and grabbing twitch messages
 * Packages message data and sends to front end to be displayed
 */

//TODO: turns links from raw text into anchor tags

const tmi = require('tmi.js');
const DOMPurify = require('dompurify');
const { ipcRenderer } = require('electron');


var client; // discord client reference 
var init = true;
var useChannel = 'smoke';
//var useChannel = 'be9ns';

// list of usernames, once size > 0 will only show chat from users in this list
var userFilter = []; 



//newClient('#shroud');       // Creating the discord client
if(init === true) {
  newClient(useChannel);
  init = false;
}


// Function that builds new discord client 
function newClient(channelName) {
  //creating tmi client
  client = new tmi.Client({
    connection: {
      secure: true
      //reconnect: true
    },
    channels: [channelName] //change to your channel 
  });
  client.connect();
  title.innerText = `Twitch chat: ${channelName}`; 
}



  
//TODO: broke asf 
ipcRenderer.on('get-chat:channel', (event, channelName) => {
  client.disconnect();
  //init = true;
  newClient(channelName);
});

// Communication from filter menu to add username to filter
ipcRenderer.on('filter:username', (event, username) => {
  userFilter.push(username);
});

// Communication from filter menu to remove all filters
ipcRenderer.on('filter:remove_all', (event) => {
  userFilter = [];
});



/*
        handling messages

        --PARAMETERS--
channel: String - Channel name
userstate: Object - Userstate object
message: String - Message received
self: Boolean - Message was sent by the client
*/
client.on('message', async (channel, userstate, message, self) => { 
  if (userFilter.length === 0 || userFilter.includes(userstate['display-name'])) {
    const content = {
      id: userstate.id,
      color: userstate['color'],
      displayName: userstate['display-name'],
      message: formatEmotes(message, userstate.emotes),
    };

    displayChatContent(content);
  }
  //console.log(content.color);
});





//sanitize text so we dont get any XXS issues 
function sanitize(text) {
  return DOMPurify.sanitize(text, { FORBID_ATTR: [ 'onerror', 'onload' ], FORBID_TAGS: [ 'script', 'iframe' ] });
}


function displayChatContent(content) {
  const element = document.createElement('div');  //creating a new html element 
  element.classList.add('message');               //add a class name to element for css styling
  

  const color = content.color || '#6441a5';

  element.innerHTML = `
  <div class="message-blob">
    <span class="display-name" style="color: ${color}">${content.displayName}:</span>
    <br>
    <span class="message">${sanitize(content.message)}</span>
  </div>`;



  // Removing old chat from dom
  let msgCount = document.getElementById('messages').childElementCount;
  if (msgCount > 15) {
    var list = document.getElementById("messages");
    list.removeChild(list.childNodes[0]);   
  }

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


