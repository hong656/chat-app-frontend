<template>
  <div>
    <div>
      <div class="relative px-4 py-10 bg-gray-700/50 shadow-xl sm:rounded-3xl sm:p-20">
        <div class="w-full mx-auto">
          <div class="divide-y divide-gray-600">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-300 sm:text-lg sm:leading-7">
              <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold text-white">Profile</h2>
                <button 
                  @click="logout" 
                  class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-700 transition-colors duration-200"
                  :disabled="loggingOut"
                >
                  {{ loggingOut ? 'Logging out...' : 'Logout' }}
                </button>
              </div>
              
              <!-- Loading state -->
              <div v-if="loading" class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              
              <!-- Error state -->
              <div v-if="error" class="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 mb-4 rounded-r-md">
                <p>{{ error }}</p>
              </div>
              
              <!-- Profile content -->
              <div v-if="!loading && !error" class="space-y-6">
                <div class="bg-gray-600/50 p-4 rounded-lg">
                  <label class="block text-sm font-medium text-gray-400">Name</label>
                  <p class="mt-1 text-lg text-white">{{ profile.name }}</p>
                </div>
                
                <div class="bg-gray-600/50 p-4 rounded-lg">
                  <label class="block text-sm font-medium text-gray-400">Email</label>
                  <p class="mt-1 text-lg text-white">{{ profile.email }}</p>
                </div>

                <div class="bg-gray-600/50 p-4 rounded-lg">
                  <label class="block text-sm font-medium text-gray-400">Role</label>
                  <p class="mt-1 text-lg text-white">{{ getRoleName(profile.role) }}</p>
                </div>
                
                <div class="bg-gray-600/50 p-4 rounded-lg">
                  <label class="block text-sm font-medium text-gray-400">Password</label>
                  <p class="mt-1 text-lg text-white">••••••••</p>
                </div>
                
                <div class="pt-4">
                  <NuxtLink :to="`/users/${profile.id}`" class="text-indigo-600 hover:text-indigo-900 text-white">
                    <button 
                      class="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-700 transition-colors duration-200"
                    >
                        Update Profile
                    </button>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  
  data() {
    return {
      profile: {
        name: '',
        email: ''
      },
      loading: false,
      error: null,
      loggingOut: false
    }
  },
  
  mounted() {
    if (process.client) {
      this.fetchProfile()
    }
  },
  
  methods: {
    getRoleName(role) {
      switch (role) {
        case 1:
          return 'Employee'
        case 2:
          return 'Internship'
        case 3:
          return 'Supervisor'
        case 4:
          return 'Manager'
        default:
          return 'Unknown'
      }
    },

    async fetchProfile() {
      this.loading = true
      this.error = null
      
      try {
        // Get token from local storage
        const token = localStorage.getItem('token')
        
        if (!token) {
          this.error = 'You are not logged in'
          this.$router.push('/login')
          return
        }
        
        // Using Nuxt 3's $fetch instead of axios
        const response = await $fetch('http://127.0.0.1:8000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        
        this.profile = response.data
      } catch (err) {
        if (err.response?.status === 401) {
          // Unauthorized - token might be expired
          localStorage.removeItem('token')
          this.$router.push('/login')
        }
        
        this.error = err.response?.data?.message || 'Failed to load profile'
        console.error('Error fetching profile:', err)
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      this.loggingOut = true
      
      try {
        const token = localStorage.getItem('token')
        
        // Call the logout API endpoint
        await $fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        
        // Clear token from localStorage
        localStorage.removeItem('token')
        
        this.$router.push('/auth/login')
        
        // Show success message (optional)
        alert('You have been successfully logged out')
      } catch (err) {
        console.error('Error during logout:', err)
        
        // Even if the API call fails, still clear the token and redirect
        localStorage.removeItem('token')
        this.$router.push('/auth/login')
      } finally {
        this.loggingOut = false
      }
    },
    
    updateProfile() {
      // Navigate to profile edit page
      this.$router.push('/profile/edit')
    }
  }
}
</script>