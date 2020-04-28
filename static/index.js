document.addEventListener('DOMContentLoaded', () => {
              const previous_channel = localStorage.getItem('user_channel');
              if (previous_channel) {
                window.location = "/chat";
              }
              // Local storage for the display name:
              document.querySelector('#submit_button').onclick = () => {
                let name = document.querySelector('#name_entry').value
                localStorage.setItem('Name', name);
              };

              // By default, submit button is disabled
              document.querySelector('#submit_button').disabled = true;

              // Enable button only if there is at least one letter in the input field
              document.querySelector('#name_entry').onkeyup = () => {
                  if (/[a-zA-Z]/.test(document.querySelector('#name_entry').value))
                      document.querySelector('#submit_button').disabled = false;
                  else
                      document.querySelector('#submit_button').disabled = true;
              };
});
