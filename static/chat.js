// Method to get the messages sent previously on that channel
function get_previous_messages(channel_name) {
    const request = new XMLHttpRequest();
    request.open('POST', '/get-messages');
    request.onload = () => {
        const response = request.responseText;
        const existing_messages = JSON.parse(response);
        localStorage.setItem('Nb_Previous_Messages', Object.keys(existing_messages).length)
        for (i = 0; i < Object.keys(existing_messages).length; i++) {
          var message_item = document.createElement('div');
          message_item.innerHTML = existing_messages[i]["timestamp"].concat(" - ", existing_messages[i]["sender"],": ", existing_messages[i]["message"]);
          const deleteB = document.createElement('button');
          deleteB.className = "delB";
          deleteB.innerHTML = 'Delete';
          message_item.append(deleteB);
          deleteB.dataset.sender = existing_messages[i]["sender"];
          deleteB.dataset.timestamp = existing_messages[i]["timestamp"];
          deleteB.dataset.message = existing_messages[i]["message"];
          deleteB.onclick = function() {
            const request = new XMLHttpRequest();
            request.open('POST', '/del-message');
            request.onload = () => {
                this.parentElement.remove();
            };
            const data = new FormData();
            data.append('sender', this.dataset.sender);
            data.append('timestamp', this.dataset.timestamp);
            data.append('message', this.dataset.message);
            data.append('channel', localStorage.getItem('user_channel'));
            request.send(data);
          };
          document.querySelector('#messages').appendChild(message_item);
        }
    };
    const data = new FormData();
    data.append('channel_name', channel_name);
    request.send(data);
};


document.addEventListener('DOMContentLoaded', () => {

            // 0 - Retrieve previously sent message for that channel
            const channel_name = localStorage.getItem('user_channel');
            get_previous_messages(channel_name);
            // 0.5 - Configure document title, url and onclick events for back buttons
            document.title = channel_name;
            history.pushState(null, channel_name, 'chat/'.concat(channel_name));
            document.querySelector('#current_chan').innerHTML='#'.concat(channel_name);
            document.querySelector('#back_name').onclick = () => {
              localStorage.removeItem('user_channel');
              window.location ="/";
            }
            document.querySelector('#back_channel').onclick = () => {
              localStorage.removeItem('user_channel');
              window.location ="/channel";
            }

            // 1 - Connect to websocket
            var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
            // When connected, configure buttons
            socket.on('connect', () => {
                // The button should emit a "Send message" event
                document.querySelector('#message_button').onclick = () => {
                  const send_message_on_channel = localStorage.getItem('user_channel');
                  const message = document.querySelector('#message_entry').value;
                  const sender = localStorage.getItem('Name');
                  // Emit to the web server the event called Send Message, associated with a json object
                  socket.emit('Send message', {'message': message, 'sender': sender, 'channel':send_message_on_channel});
                  document.querySelector('#message_entry').value = "";
                }
            });

            // When a new message is announced, add message to list and configure delete button
            // Comment: Improvement: factor out the code to create the delete button
            socket.on('deliver message', data => {
                const current_channel = localStorage.getItem('user_channel');
                if (data.channel==current_channel) {
                  const msg = document.createElement('div');
                  msg.innerHTML = `${data.time} - ${data.sender}: ${data.message}`;
                  const deleteB = document.createElement('button');
                  deleteB.className = "delB";
                  deleteB.innerHTML = 'Delete';
                  deleteB.dataset.sender = `${data.sender}`;
                  deleteB.dataset.timestamp = `${data.time}`;
                  deleteB.dataset.message = `${data.message}`;
                  deleteB.onclick = function() {
                    const request = new XMLHttpRequest();
                    request.open('POST', '/del-message');
                    request.onload = () => {
                        this.parentElement.remove();
                    };
                    const data = new FormData();
                    data.append('sender', this.dataset.sender);
                    data.append('timestamp', this.dataset.timestamp);
                    data.append('message', this.dataset.message);
                    data.append('channel', localStorage.getItem('user_channel'));
                    request.send(data);
                  };
                  msg.append(deleteB);
                  document.querySelector('#messages').append(msg);

                }
            });
});
