function get_previous_messages(channel_name) {
    const request = new XMLHttpRequest();
    request.open('POST', '/get-messages');
    request.onload = () => {
        const response = request.responseText;
        const existing_messages = JSON.parse(response);
        localStorage.setItem('Nb_Previous_Messages', Object.keys(existing_messages).length)
        for (i = 0; i < Object.keys(existing_messages).length; i++) {
          var message_item = document.createElement('li');
          message_item.innerHTML = existing_messages[i]["timestamp"].concat(" - ", existing_messages[i]["sender"],": ", existing_messages[i]["message"]);
          document.querySelector('#messages').appendChild(message_item);
        }
    };
    const data = new FormData();
    data.append('channel_name', channel_name);
    request.send(data);
};


document.addEventListener('DOMContentLoaded', () => {
            const channel_name = localStorage.getItem('user_channel');
            document.title = channel_name;
            history.pushState(null, channel_name, 'chat/'.concat(channel_name));
            document.querySelector('#current_chan').innerHTML=channel_name;
            get_previous_messages(channel_name);

            // Connect to websocket
            var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

            // When connected, configure buttons
            socket.on('connect', () => {

                // The button should emit a "Send message" event
                document.querySelector('#message_button').onclick = () => {
                  const message = document.querySelector('#message_entry').value;
                  const sender = localStorage.getItem('Name');
                  const channel1 = localStorage.getItem('user_channel');
                  // Emit to the web server the event called Send Message, associated with a json object
                  socket.emit('Send message', {'message': message, 'sender': sender, 'channel':channel1});
                }
            });

            // When a new message is announced, add to the unordered list
            socket.on('deliver message', data => {
                const current_channel = localStorage.getItem('user_channel');
                if (data.channel==current_channel) {
                  const li = document.createElement('li');
                  li.innerHTML = `${data.time} - ${data.sender}: ${data.message}`;
                  document.querySelector('#messages').append(li);
                  document.querySelector('#message_entry').value = "";
                }
            });
});
