# Project 2

Here is a small chat app built using Python and FLASK, as well as html/CSS/Javascript for the front end.  
Users can:  
-type in a display name that will eventually be associated with every message the user sends. If a user closes the page and returns to the app later, the display name is remembered.  
-create a new channel, so long as its name doesn’t conflict with the name of an existing channel.   
-see a list of all current channels, and selecting one allows the user to view the channel.  
-once a channel is selected, the user can see any messages that have already been sent in that channel, up to a maximum of 100 messages. These messages are stored server-side.  
-send text messages to others in the channel. When a user sends a message, the display name and the timestamp of the message is associated with the message. All users in the channel can see the new message (with display name and timestamp) appear on their chat page. Sending and receiving messages does not require reloading the page, leveraging the capabilities offered by socket.io.  
-if a user is on a chat page, closes the web browser window, and goes back to the web application, the application remembers what channel the user was on previously and takes the user back to that channel.  
-delete any message that was sent in the chatroom he currently is. This deletes the message from the server-side memory.  

Files:  
-application.py is the main Python file.  
-index.html and index.js handle the home page  
-channel.html and channel.js provide the list of existing channels and the possibility to add channels to that list.  
-chat.html and chat.js handle the chatrooms.  
-index.html and channel.html extend layout.html.  
-chat.html extends layout_chatroom.html.
