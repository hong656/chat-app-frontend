<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">User List</h2>

    <div v-if="loading" class="text-center py-4">
      <p class="text-gray-500">Loading users...</p>
    </div>

    <div v-else-if="error" class="text-center py-4">
      <p class="text-red-500">Error: {{ error }}</p>
    </div>

    <div v-else>
      <p class="text-gray-700 mb-2">Found {{ users.length }} users</p>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ user.user_id }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ user.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-500">
                  {{ user.email }}
                </div>
              </td>
              <!-- Action column button -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="createChat(user.user_id)" class="text-indigo-600 hover:text-indigo-900">
                  Create Chat
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const loading = ref(true);
const error = ref(null);
let token = ''
if (process.client) {
  token = localStorage.getItem('token') || ''
}
const loggedInUserId = ref(null);
onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/get');
    users.value = response.data;
  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});


const createChat = async (otherUserId) => {
  try {
    const chatData = {
      is_group: false,
      title: null,
      members: [otherUserId],
    };

    const response = await axios.post('http://127.0.0.1:8000/api/chat', chatData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

    console.log('Chat created:', response.data);
    alert('Chat created successfully!');
  } catch (err) {
    console.error('Error creating chat:', err);
    // Optionally, handle errors (e.g., show an error message)
    alert('Error creating chat: ' + (err.response?.data?.message || err.message));  // Display error from the backend, if available.
  }
};
</script>

<style scoped>
div {
  padding: 16px;
}
</style>