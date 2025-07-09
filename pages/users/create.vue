<template>
    <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto p-10 boxes">
        <div class="shadow-xl rounded-2xl overflow-hidden">
          <!-- Header -->
          <div class="px-6 py-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Create New User</h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2">Fill in the details to create a new user</p>
          </div>
  
          <!-- Form -->
          <form @submit.prevent="submitForm" class="px-6 py-8 space-y-6">
            <!-- Name Field -->
            <div class="space-y-2">
              <label for="name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                maxlength="191"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 dark:bg-gray-700 dark:text-white"
                placeholder="Enter full name"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
            </div>
  
            <!-- Email Field -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                maxlength="191"
                autocomplete="off"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>
  
            <!-- Password Field -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  maxlength="191"
                  autocomplete="new-password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter password"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.828 1.828L8.05 8.05m5.993 5.993L15.88 15.88m-1.829-1.828L15.88 15.88M12 3c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21l-6-6m0 0l-2.879-2.879m0 0L9.879 9.879M12 12l-3-3"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
            </div>

            <!-- Password Confirmation Field -->
            <div class="space-y-2">
              <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password Confirmation <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  maxlength="191"
                  autocomplete="new-password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Confirm password"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password_confirmation }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.828 1.828L8.05 8.05m5.993 5.993L15.88 15.88m-1.829-1.828L15.88 15.88M12 3c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21l-6-6m0 0l-2.879-2.879m0 0L9.879 9.879M12 12l-3-3"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
              <p v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1">{{ errors.password_confirmation }}</p>
            </div>
  
            <!-- Submit Button -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="resetForm"
                class="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Reset Form
              </button>
              
              <button
                type="submit"
                :disabled="loading"
                class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>
                  Create User
                </span>
              </button>
            </div>
          </form>
  
          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mx-6 mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-green-800 dark:text-green-200">{{ successMessage }}</p>
            </div>
          </div>
  
          <div v-if="errorMessage" class="mx-6 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
    .boxes{
        border: 1px solid #e5e7eb;
        border-radius: 10px;
    }
</style>

<script>
export default {
    name: 'UserForm',

    data() {
        return {
        form: {
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
        },
        errors: {},
        loading: false,
        showPassword: false,
        successMessage: '',
        errorMessage: ''
        }
    },

    methods: {
        validateForm() {
        this.errors = {}
        
        // Name validation
        if (!this.form.name.trim()) {
            this.errors.name = 'Name is required'
        } else if (this.form.name.length > 191) {
            this.errors.name = 'Name must be less than 191 characters'
        }
        
        // Email validation
        if (!this.form.email.trim()) {
            this.errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
            this.errors.email = 'Please enter a valid email address'
        } else if (this.form.email.length > 191) {
            this.errors.email = 'Email must be less than 191 characters'
        }
        
        // Password validation
        if (!this.form.password.trim()) {
            this.errors.password = 'Password is required'
        } else if (this.form.password.length < 8) {
            this.errors.password = 'Password must be at least 8 characters long'
        } else if (this.form.password.length > 191) {
            this.errors.password = 'Password must be less than 191 characters'
        }

        // Password confirmation validation
        if (!this.form.password_confirmation.trim()) {
            this.errors.password_confirmation = 'Password confirmation is required'
        } else if (this.form.password !== this.form.password_confirmation) {
            this.errors.password_confirmation = 'Password confirmation does not match'
        }
        
        return Object.keys(this.errors).length === 0
        },
        
        async submitForm() {
        if (!this.validateForm()) {
            return
        }
        
        this.loading = true
        this.successMessage = ''
        this.errorMessage = ''
        
        try {
            const payload = {
            name: this.form.name.trim(),
            email: this.form.email.trim(),
            password: this.form.password,
            password_confirmation: this.form.password_confirmation
            }
            
            const response = await $fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: payload
            })
            
            this.successMessage = 'User created successfully!'
            this.resetForm()
            this.$emit('success', response)
            
        } catch (error) {
            console.error('Error submitting form:', error)
            
            if (error.response?.status === 422) {
            // Validation errors from server
            const serverErrors = error.response.data.errors || {}
            this.errors = { ...this.errors, ...serverErrors }
            } else {
            this.errorMessage = error.response?.data?.message || 
                'An error occurred while processing your request'
            }
        } finally {
            this.loading = false
        }
        },
        
        resetForm() {
        this.form = {
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
        }
        this.errors = {}
        this.successMessage = ''
        this.errorMessage = ''
        }
    }
}
</script>