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
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <!-- Add more columns as needed -->
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ user.email }}
                  </div>
                </td>
                <!-- Add more columns as needed, mapping to user properties -->
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
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get');
      console.log('Raw response:', response.data);
  
      users.value = response.data; // Now it's a direct array
      console.log('Users after assignment:', users.value);
      console.log('Users length:', users.value.length);
    } catch (err) {
      console.error('Error fetching users:', err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style scoped>
  /* Optional: Add some padding/margin to the container, if needed */
  div {
    padding: 16px;
  }
  </style>