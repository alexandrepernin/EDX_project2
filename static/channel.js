//Method #1: Get the channels that were previously created and create the associated links to chatorooms
//Comment: Improvement: Factor out the code within for loop
function get_channels(channel_list) {
    const request = new XMLHttpRequest();
    request.open('GET', '/get-channels');
    request.onload = () => {
        var existing_channels = JSON.parse(request.responseText);
        for (i = 0; i < existing_channels.length; i++) {
          channel_list.push(existing_channels[i]);
          var list_item = document.createElement('a');
          list_item.className = "nav-link";
          list_item.dataset.channel = existing_channels[i];
          list_item.id = existing_channels[i];
          list_item.href = "/chat";
          list_item.innerHTML = "Channel   #".concat(existing_channels[i]);
          document.querySelector('#link_list').appendChild(list_item);
        }
        document.querySelectorAll('.nav-link').forEach(link => {
                      link.onclick = () => {
                          var data = link.dataset.channel;
                          localStorage.setItem('user_channel', data);
                          window.location ="/chat";
                          return false;
                      };
                  });

        };

    request.send();
};

//Method #2: Ajax request to store the new channel name server-side when a user creates one.
//Comment: Improvement: once sent, do not reload the page but call get_channels()
function post_new_channel() {
  const request = new XMLHttpRequest();
  const channel_name = document.querySelector('#channel_entry').value;
  request.open('POST', '/create-channel');

  request.onload = () => {
      location.reload();
  };
  const data = new FormData();
  data.append('channel_name', channel_name);
  request.send(data);
};

//Method #3: Method to make sure the channel doesn't already exists before calling post_new_channel
function prevent_channel_duplicates(channel_list) {
  if (!(channel_list.includes(document.querySelector('#channel_entry').value)) && (/[a-zA-Z]/.test(document.querySelector('#channel_entry').value))) {
    document.querySelector('#submit_button').disabled = false;
  }
  else {
    document.querySelector('#submit_button').disabled = true;
  }
};

document.addEventListener('DOMContentLoaded', () => {

      var channel_list = [];

      // 0 - Redirect to chatroom if user closed the window and comes back to the site
      const previous_channel = localStorage.getItem('user_channel');
      if (previous_channel) {
        window.location = "/chat";
      }

      // 1 - Get list of existing channels
      get_channels(channel_list);

      // 2 - Update welcome message with name stored in local storage
      document.querySelector('#Name').innerHTML = 'Hello '.concat(localStorage.getItem('Name'));

      // 3 - Set the onsubmit property of the button: Ajax request to store server-side the new channel name
      document.querySelector('#form').onsubmit = () => post_new_channel();

      // 4 - Make sure the channel name is new
      // 4.1 - By default, submit button is disabled
      document.querySelector('#submit_button').disabled = true;
      // 4.2 - On key up => verifies that contains at least one letter and that the channels is not already in the channel list
      document.querySelector('#channel_entry').onkeyup = () => prevent_channel_duplicates(channel_list);

      document.getElementById('link_list').childNodes.forEach(link => {
                    link.onclick = () => {
                        var channel_name = link.dataset.channel;
                        localStorage.setItem('user_channel', channel_name);
                        return false;
                    };
                });

 });
