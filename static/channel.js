
document.addEventListener('DOMContentLoaded', () => {
      // 1 - Update welcome message with name stored in local storage
      let hello = 'Hello ';
      document.querySelector('#Name').innerHTML = hello.concat(localStorage.getItem('Name'));

      // 2 - Set the onsubmit property of the button: Ajax request to store server-side the new channel name
      document.querySelector('#form').onsubmit = () => {

          // 2.1 - Initialize new request
          const request = new XMLHttpRequest();
          const channel_name = document.querySelector('#channel_entry').value;
          request.open('POST', '/create-channel');

          request.onload = () => {
              location.reload();
          }

          // 2.2 - Add data to send with request: the name of the new channel
          const data = new FormData();
          data.append('channel_name', channel_name);

          // 2.3 - Send request
          request.send(data);
          return false;
        };


        // 3 - Make sure the channel name is new
        // 3.1 - By default, submit button is disabled
        document.querySelector('#submit_button').disabled = true;
        // 3.2 - On key up => verifies that contains at least one letter and that the channels is not already in the channel list
        document.querySelector('#channel_entry').onkeyup = () => {
          if (!(channels.includes(document.querySelector('#channel_entry').value)) && (/[a-zA-Z]/.test(document.querySelector('#channel_entry').value))) {
            document.querySelector('#submit_button').disabled = false;
          }
          else {
            document.querySelector('#submit_button').disabled = true;
          }

        };

 });
