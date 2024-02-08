// Fetch the list of existing chat messages.
function getMessages() {
  fetch(`/api/room/${roomId}/messages`)
    .then(response => response.json())
    .then(messages => {
      // Clear existing messages
      const messagesContainer = document.querySelector('.messages');
      messagesContainer.innerHTML = '';

      // Create HTML elements for messages
      messages.forEach(message => {
        const messageElement = document.createElement('message');
        const authorElement = document.createElement('author');
        const contentElement = document.createElement('content');
        authorElement.textContent = message.author;
        contentElement.textContent = message.content;
        messageElement.appendChild(authorElement);
        messageElement.appendChild(contentElement);
        messagesContainer.appendChild(messageElement);
      });
    })
    .catch(error => console.error('Error fetching messages:', error));
}

// POST to the API when the user posts a new message.
function postMessage(content) {
  fetch(`/api/room/${roomId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ content })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to post message');
      }
    })
    .catch(error => console.error('Error posting message:', error));
}

// Automatically poll for new messages on a regular interval.
function startMessagePolling() {
  setInterval(getMessages, 100);
}

// Allow changing the name of a room
function updateRoomName(newName) {
  fetch(`/api/room/${roomId}/name`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ name: newName })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update room name');
      }
    })
    .catch(error => console.error('Error updating room name:', error));
}

document.addEventListener('DOMContentLoaded', function () {
  const roomNameDisplay = document.querySelector('.roomName');
  const roomNameInput = document.querySelector('.editForm input');
  const editButton = document.querySelector('.editButton');
  const saveButton = document.querySelector('.saveButton');
  const cancelButton = document.querySelector('.cancelButton');

  // Show room name edit form
  editButton.addEventListener('click', function () {
    roomNameDisplay.classList.add('hide');
    roomNameInput.value = roomNameDisplay.textContent;
    editButton.parentElement.classList.add('hide');
    saveButton.parentElement.classList.remove('hide');
  });

  // Save modified room name
  saveButton.addEventListener('click', function () {
    const newName = roomNameInput.value;
    fetch(`/api/room/${roomId}/name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': WATCH_PARTY_API_KEY
      },
      body: JSON.stringify({ name: newName })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update room name');
      }
      // Update room name on the page
      roomNameDisplay.textContent = newName;
      // Hide edit form and show room name display
      roomNameDisplay.classList.remove('hide');
      editButton.parentElement.classList.remove('hide');
      saveButton.parentElement.classList.add('hide');
    })
    .catch(error => console.error('Error updating room name:', error));
  });

  // Cancel editing
  cancelButton.addEventListener('click', function () {
    // Hide edit form and show room name display
    roomNameDisplay.classList.remove('hide');
    editButton.parentElement.classList.remove('hide');
    saveButton.parentElement.classList.add('hide');
  });
});

/* For profile.html */

function updateUsername(newUsername) {
  fetch('/api/user/name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ username: newUsername })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update username');
      }
      // Optionally, update the displayed username on the page
    })
    .catch(error => console.error('Error updating username:', error));
}

function updatePassword(newPassword) {
  fetch('/api/user/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ password: newPassword })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update password');
      }
      // Update the password in the cookie
      document.cookie = `user_password=${newPassword}`;
      // Optionally, provide feedback to the user that the password was updated
    })
    .catch(error => console.error('Error updating password:', error));
}

document.addEventListener('DOMContentLoaded', function() {
  const updateUsernameButton = document.getElementById('updateUsernameButton');
  const updatePasswordButton = document.getElementById('updatePasswordButton');
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');

    updateUsernameButton.addEventListener('click', function() {
      updateUsername(usernameInput.value);
    });

    updatePasswordButton.addEventListener('click', function() {
      updatePassword(passwordInput.value);
    });
});
