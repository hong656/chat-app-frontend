<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="text-white w-64 space-y-6 py-7 px-2 inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out bg-gray-800" :class="{ 'translate-x-0': isOpen }">

    </div>
    <div class="side text-white w-64 space-y-6 py-7 px-2 inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out bg-gray-800" :class="{ 'translate-x-0': isOpen }">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2 px-4">
        <span class="text-2xl font-extrabold">Admin</span>
      </NuxtLink>

      <!-- Nav -->
      <nav>
        <!-- Dashboard -->
        <div class="px-4 py-2">
          <NuxtLink to="/dashboard" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Dashboard
          </NuxtLink>
        </div>

        <!-- Users Dropdown -->
        <div class="px-4 py-2">
          <button @click="toggleDropdown('users')" class="flex items-center justify-between w-full py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            <span>Users</span>
            <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': openDropdown === 'users' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-show="openDropdown === 'users'" class="mt-2 space-y-2">
            <NuxtLink to="/users/list" class="block py-2 px-8 rounded transition duration-200 hover:bg-gray-700">
              User List
            </NuxtLink>
            <NuxtLink to="/users/create" class="block py-2 px-8 rounded transition duration-200 hover:bg-gray-700">
              Create User
            </NuxtLink>
          </div>
        </div>

        <!-- Settings Dropdown -->
        <div class="px-4 py-2">
          <button @click="toggleDropdown('settings')" class="flex items-center justify-between w-full py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            <span>Settings</span>
            <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': openDropdown === 'settings' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-show="openDropdown === 'settings'" class="mt-2 space-y-2">
            <NuxtLink to="/settings/general" class="block py-2 px-8 rounded transition duration-200 hover:bg-gray-700">
              General
            </NuxtLink>
            <NuxtLink to="/settings/security" class="block py-2 px-8 rounded transition duration-200 hover:bg-gray-700">
              Security
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>

    <!-- Mobile menu button -->
    <div class="md:hidden">
      <button @click="toggleSidebar" class="fixed top-4 left-4 z-20 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.side {
  border-right: 1px solid #e5e7eb;
  position: fixed;
}
</style>

<script setup>
const isOpen = ref(false)
const openDropdown = ref(null)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const toggleDropdown = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown
}
</script>