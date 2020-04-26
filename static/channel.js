var channel_list = [];
// 0 - Get list of current channels

function get_channels(channel_list) {
    const request = new XMLHttpRequest();
    request.open('GET', '/get-channels');
    request.onload = () => {
        var existing_channels = JSON.parse(request.responseText);
        for (i = 0; i < existing_channels.length; i++) {
          channel_list.push(existing_channels[i]);
          var list_item = document.createElement('a');
          list_item.className = "nav-link";
          var channel_name = existing_channels[i];
          list_item.dataset.channel = existing_channels[i];
          list_item.id = existing_channels[i];
          list_item.href = "/chat";
          list_item.innerHTML = "Channel ".concat(i.toString(), ": ",existing_channels[i]);
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

function prevent_channel_duplicates() {
  if (!(channel_list.includes(document.querySelector('#channel_entry').value)) && (/[a-zA-Z]/.test(document.querySelector('#channel_entry').value))) {
    document.querySelector('#submit_button').disabled = false;
  }
  else {
    document.querySelector('#submit_button').disabled = true;
  }
};

document.addEventListener('DOMContentLoaded', () => {

      // 1 - Get list of existing channels
      get_channels(channel_list);

      // 1 - Update welcome message with name stored in local storage
      document.querySelector('#Name').innerHTML = 'Hello '.concat(localStorage.getItem('Name'));

      // 2 - Set the onsubmit property of the button: Ajax request to store server-side the new channel name
      document.querySelector('#form').onsubmit = () => post_new_channel();

      // 3 - Make sure the channel name is new
      // 3.1 - By default, submit button is disabled
      document.querySelector('#submit_button').disabled = true;
      // 3.2 - On key up => verifies that contains at least one letter and that the channels is not already in the channel list
      document.querySelector('#channel_entry').onkeyup = () => prevent_channel_duplicates();

      document.getElementById('link_list').childNodes.forEach(link => {
                    link.onclick = () => {
                        var dataloop = link.dataset.channel;
                        localStorage.setItem('user_channel', dataloop);
                        return false;
                    };
                });

 });
