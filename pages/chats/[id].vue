<template>
  <div class="tg-container">
    <div class="tg-chat-header">
      {{ chatName }}
    </div>
    <div class="tg-chat-messages" ref="chatMessagesContainer">
      <div
        v-for="message in messages"
        :key="message.message_id"
        :class="[
          'tg-message',
          message.is_you ? 'tg-message-sent' : 'tg-message-received',
        ]"
      >
        <div class="tg-message-header">
          <span class="tg-message-sender">{{ message.sender.name }}</span>
        </div>
        <div class="tg-message-content">
          {{ message.text }}
        </div>
        <div class="tg-message-footer">
          <span class="tg-message-time">{{ formatTime(message.created_at) }}</span>
          <button v-if="message.is_you" @click="openDeleteDialog(message.message_id)" class="tg-message-delete-button">
            <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
              <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div ref="scrollTarget"></div>
    </div>

    <div class="tg-chat-input">
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
      <button @click="sendMessage">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
          />
        </svg>
      </button>
    </div>

     <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeDeleteDialog"></div>
      <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg font-medium text-gray-900" id="modal-title">
            Delete Message
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">Delete message for:</p>
            <div class="mt-4 space-y-2">
              <div class="flex items-center">
                <input id="deleteForMe" name="deleteOption" type="radio" value="me" v-model="deleteOption" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                <label for="deleteForMe" class="ml-3 block text-sm font-medium text-gray-700">
                  Only for me
                </label>
              </div>
              <div class="flex items-center">
                <input id="deleteForEveryone" name="deleteOption" type="radio" value="everyone" v-model="deleteOption" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                <label for="deleteForEveryone" class="ml-3 block text-sm font-medium text-gray-700">
                  Everyone
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" @click="confirmDelete">
            Delete
          </button>
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="closeDeleteDialog">
            Cancel
          </button>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();

// **RENAME THIS TO `chatId`** to avoid confusion
const chatId = ref(route.params.id);

const messages = ref([]);
const newMessage = ref('');
const chatMessagesContainer = ref(null);
const scrollTarget = ref(null);
const apiUrl = 'http://127.0.0.1:8000/api/messages';
const chatApiUrl = 'http://127.0.0.1:8000/api/chat';
const token = ref('');
const chatName = ref('Loading...');

// Fetch logged in user's profile.
const loggedInUserId = ref(null);

// The Nuxt app instance
const nuxtApp = useNuxtApp();
const echo = nuxtApp.$echo;

const messageToDeleteId = ref(null);
const deleteOption = ref('me');
const isDeleteModalOpen = ref(false);

async function fetchUserProfile() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/profile', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    loggedInUserId.value = response.data.data.user_id;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

onMounted(async () => {
  if (process.client) {
    token.value = localStorage.getItem('token') || '';
  }

  await fetchUserProfile(); // Fetch the user's profile
  await fetchChatData();
  await fetchMessages();

  echo.private(`chat.${chatId.value}`)
    .listen('MessageSent', (event) => {
      console.log('[Echo] Received MessageSent:', event);

      const newMsg = event.message;

      // **USE `loggedInUserId` HERE**
      newMsg.is_you = newMsg.sender.user_id === loggedInUserId.value;
      messages.value.push(newMsg);

      nextTick(() => {
        scrollTarget.value?.scrollIntoView({ behavior: 'smooth' });
      });
    })
    .listen('MessageDeleted', (event) => {
      console.log('[Echo] Received MessageDeleted:', event);

      messages.value = messages.value.filter(
        (message) => message.message_id != event.messageId
      );
    });
});

const openDeleteDialog = (messageId) => {
  messageToDeleteId.value = messageId;
  deleteOption.value = 'me';
  isDeleteModalOpen.value = true;
};

const closeDeleteDialog = () => {
  isDeleteModalOpen.value = false;
};

const confirmDelete = async () => {
  isDeleteModalOpen.value = false;
  const deleteForEveryone = deleteOption.value === 'everyone';
  await deleteMessage(messageToDeleteId.value, deleteForEveryone);
  messageToDeleteId.value = null;
};

async function fetchChatData() {
  try {
    const response = await axios.get(`${chatApiUrl}/${chatId.value}`, { // USE chatId here
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json',
      },
    });
     if (response.data.success && response.data.data) {
        const chatData = response.data.data;

        if(chatData.is_group){
            chatName.value = chatData.title;
        }else{
            const otherParticipant = chatData.members.find(member => !member.is_you);
            chatName.value = otherParticipant ? otherParticipant.name : 'Chat';
        }
    }else{
       console.warn("Failed to get chat data");
       chatName.value = "Chat";
    }
  } catch (error) {
    console.error('Error fetching chat data:', error);
    chatName.value = 'Chat';
  }
}

async function fetchMessages() {
  try {
    const response = await axios.get(`${apiUrl}/${chatId.value}`, {  // USE chatId here
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json',
      },
    });
    messages.value = response.data.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    if (error.response && error.response.status === 401) {
      // Redirect to login, clear token
      // window.location.href = '/login';
      // localStorage.removeItem('token');
    }
  }
}

async function sendMessage() {
  if (newMessage.value.trim() === '') {
    return;
  }

  try {
    await axios.post(
      apiUrl,
      {
        chat_id: chatId.value,  // USE chatId here
        message_type: 'text',
        text: newMessage.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: 'application/json',
        },
      }
    );

    newMessage.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
    if (error.response && error.response.status === 401) {
      // Redirect to login, clear token
      // window.location.href = '/login';
      // localStorage.removeItem('token');
    }
  }
}

async function deleteMessage(messageId, deleteForEveryone = false) {
  try {
    await axios.delete(`${apiUrl}/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: {
        delete_for_everyone: deleteForEveryone,
      }
    });
    if (!deleteForEveryone) {
      await fetchMessages();
    }
  } catch (error) {
    console.error('Error deleting message:', error);
  }
}

function formatTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
</script>

<style scoped>
.tg-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.tg-chat-header {
  background-color: grey;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.tg-chat-messages {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.tg-message {
  padding: 8px 12px;
  border-radius: 20px;
  margin-bottom: 5px;
  max-width: 70%;
  position: relative;
}

.tg-message-sent {
  background-color: rgb(44, 44, 87);
  border: 1px solid #eee;
  align-self: flex-end;
  margin-right: 10px;
}

.tg-message-received {
  background-color: grey;
  border: 1px solid #eee;
  align-self: flex-start;
  margin-left: 10px;
}

.tg-message-header {
  font-size: 0.8em;
  color: #555;
  margin-bottom: 3px;
}

.tg-message-sender {
  font-weight: bold;
  color: white;
}

.tg-message-content {
  word-wrap: break-word;
}

.tg-message-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.7em;
  color: #888;
}

.tg-message-time {
  color: white;
  margin-right: 8px;
}

.tg-message-delete-button {
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.tg-chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.tg-chat-input input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
}

.tg-chat-input button {
  background-color: #5682a3;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tg-chat-input button svg {
  width: 20px;
  height: 20px;
}
</style>