<!-- pages/chats/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Messages</h1>
        <p class="text-gray-600 mt-2">{{ chats.length }} conversations</p>
      </div>

      <div v-if="pending" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center space-x-4">
              <div class="rounded-full bg-gray-300 h-12 w-12"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                <div class="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading chats</h3>
            <div class="mt-2 text-sm text-red-700">
              <p><strong>{{ error.statusCode }} {{ error.statusMessage }}</strong></p>
              <p class="mt-1">{{ error.data?.message || error.message }}</p>
              <button 
                @click="refresh()" 
                class="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="space-y-2">
        <div 
          v-for="chat in chats" 
          :key="chat.chat_id"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <NuxtLink 
            :to="`/chats/${chat.chat_id}`"
            class="block p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 flex-1">
                <!-- Chat Avatar -->
                <div class="relative">
                  <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {{ getInitials(getChatTitle(chat)) }}
                  </div>
                  <div v-if="!chat.is_group" class="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>

                <!-- Chat Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">
                      {{ getChatTitle(chat) }}
                      <span v-if="chat.is_group" class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Group
                      </span>
                    </h3>
                    <span v-if="chat.latest_message" class="text-sm text-gray-500 flex-shrink-0">
                      {{ formatTime(chat.latest_message.created_at) }}
                    </span>
                  </div>

                  <!-- Latest Message or Members Info -->
                  <div class="text-sm text-gray-600">
                    <div v-if="chat.latest_message" class="flex items-center">
                      <span class="font-medium mr-2">{{ chat.latest_message.sender.is_you ? 'You' : chat.latest_message.sender.name }}:</span>
                      <span class="truncate">{{ chat.latest_message.text }}</span>
                    </div>
                    <div v-else class="flex items-center text-gray-500">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                      </svg>
                      <span>No messages yet</span>
                    </div>
                  </div>

                  <!-- Members count for groups -->
                  <div v-if="chat.is_group" class="mt-1 text-xs text-gray-500">
                    {{ chat.members.length }} members
                  </div>
                </div>
              </div>

              <!-- Arrow indicator -->
              <div class="ml-4 flex-shrink-0">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-if="chats.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
          <p class="mt-1 text-sm text-gray-500">Start a new conversation to get started.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  user_id: number;
  name: string;
  is_you: boolean;
  pivot: {
    chat_id: number;
    user_id: number;
    joined_at: string;
    is_admin: number;
  };
}

interface LatestMessage {
  message_id: number;
  chat_id: number;
  sender_id: number;
  message_type: string;
  text: string;
  content_url: string | null;
  created_at: string;
  replied_to_id: number | null;
  sender: {
    user_id: number;
    name: string;
    is_you: boolean;
  };
}

interface Chat {
  chat_id: number;
  is_group: boolean;
  title: string;
  created_at: string;
  members: User[];
  latest_message: LatestMessage | null;
}

interface ApiResponse {
  success: boolean;
  data: Chat[];
}

// Set page title
useHead({
  title: 'Chats - Your App Name'
});

let token = ''
if (process.client) {
  token = localStorage.getItem('token') || ''
}

const { data: response, pending, error, refresh } = await useFetch<ApiResponse>('http://127.0.0.1:8000/api/chat', {
  server: false,
  default: () => ({ success: false, data: [] }),
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      console.error('Unauthorized - token may be invalid or expired');
    }
  }
});

const chats = computed(() => response.value?.data || []);

// Helper functions
function getChatTitle(chat: Chat): string {
  if (chat.is_group) {
    return chat.title; // For groups, use the actual title
  } else {
    // For direct messages, find the other person's name
    const otherPerson = chat.members.find(member => !member.is_you);
    return otherPerson ? otherPerson.name : chat.title;
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
  
  return date.toLocaleDateString();
}
</script>