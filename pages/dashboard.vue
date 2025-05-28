<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-200">Dashboard</h1>
      <div class="flex gap-4">
        <!-- Punch In Button - Only show if not punched in -->
        <button 
          v-if="!punchInTime"
          @click="showPunchInDialog = true"
          class="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Punch In
        </button>
        
        <!-- Punch Out Button - Only show if punched in -->
        <button 
          v-if="punchInTime && !punchOutTime"
          @click="showPunchOutDialog = true"
          class="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Punch Out
        </button>
        
        <!-- Break Button (keep existing) -->
        <button 
          @click="handleBreakToggle"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-colors',
            isOnBreak ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          ]"
        >
          {{ isOnBreak ? 'End Break' : 'Take Break' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Welcome Section -->
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <!-- 🔴 DYNAMIC: Employee name from API -->
              <h2 class="text-xl font-semibold text-gray-200">
                Good {{ timeOfDay }}, {{ employeeName }}.
              </h2>
              <!-- 🔴 DYNAMIC: Current time and timezone from API -->
              <p class="text-gray-400 mt-1">
                It's {{ currentTime }} ({{ timezone }})
              </p>
              <!-- 🔴 DYNAMIC: Early/late status calculated from API -->
              <p class="text-gray-400 mt-1" v-if="arrivalStatus">
                {{ arrivalStatus }}
              </p>
            </div>
            <!-- 🔴 DYNAMIC: Early status badge -->
            <span 
              v-if="isEarly" 
              class="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              Early
            </span>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <!-- Punch In Time -->
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <!-- 🔴 DYNAMIC: Punch in time from API -->
                <p class="text-lg font-semibold">{{ punchInTime || 'Not yet' }}</p>
                <p class="text-gray-400 text-sm">Punch in time</p>
              </div>
            </div>

            <!-- Punch Out Time -->
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <!-- 🔴 DYNAMIC: Punch out time from API -->
                <p class="text-lg font-semibold">{{ punchOutTime || 'Not yet' }}</p>
                <p class="text-gray-400 text-sm">Punch out time</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Leave Allowance -->
          <div class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4">{{ leaveStats.totalAllowance }}</h3>
            <p class="text-gray-400 text-sm mb-4">Total leave allowance</p>
            <div class="space-y-2">
              <!-- 🔴 DYNAMIC: Leave data from API -->
              <div class="flex justify-between items-center">
                <span class="text-blue-400 text-sm">Paid</span>
                <span class="text-sm">{{ leaveStats.paidAllowance }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-green-400 text-sm">Unpaid</span>
                <span class="text-sm">{{ leaveStats.unpaidAllowance }}</span>
              </div>
            </div>
          </div>

          <!-- Leave Taken -->
          <div class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4">{{ leaveStats.totalTaken }}</h3>
            <p class="text-gray-400 text-sm mb-4">Total leave taken</p>
            <div class="space-y-2">
              <!-- 🔴 DYNAMIC: Leave taken data from API -->
              <div class="flex justify-between items-center">
                <span class="text-blue-400 text-sm">Paid</span>
                <span class="text-sm">{{ leaveStats.paidTaken }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-green-400 text-sm">Unpaid</span>
                <span class="text-sm">{{ leaveStats.unpaidTaken }}</span>
              </div>
            </div>
          </div>

          <!-- Leave Available -->
          <div class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4">{{ leaveStats.totalAvailable }}</h3>
            <p class="text-gray-400 text-sm mb-4">Total leave available</p>
            <div class="space-y-2">
              <!-- 🔴 DYNAMIC: Available leave data from API -->
              <div class="flex justify-between items-center">
                <span class="text-blue-400 text-sm">Paid</span>
                <span class="text-sm">{{ leaveStats.paidAvailable }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-green-400 text-sm">Unpaid</span>
                <span class="text-sm">{{ leaveStats.unpaidAvailable }}</span>
              </div>
            </div>
          </div>

          <!-- Leave Requests -->
          <div class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4">{{ leaveRequests.pending }}</h3>
            <p class="text-gray-400 text-sm mb-4">Leave request pending</p>
            <div class="space-y-2">
              <!-- 🔴 DYNAMIC: Leave request data from API -->
              <div class="flex justify-between items-center">
                <span class="text-blue-400 text-sm">Paid</span>
                <span class="text-sm">{{ leaveRequests.paidPending }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-green-400 text-sm">Unpaid</span>
                <span class="text-sm">{{ leaveRequests.unpaidPending }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Time Log -->
        <div class="bg-gray-800 rounded-xl p-6">
          <h3 class="text-xl font-semibold mb-6">Time Log</h3>
          
          <!-- Today's Log -->
          <div class="mb-6">
            <h4 class="text-lg font-medium mb-4">Today</h4>
            <div class="grid grid-cols-4 gap-4 text-center">
              <!-- 🔴 DYNAMIC: Today's time data from API -->
              <div>
                <p class="text-sm text-gray-400">Scheduled</p>
                <p class="font-semibold">{{ todayLog.scheduled }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Worked</p>
                <p class="font-semibold">{{ todayLog.worked }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Break</p>
                <p class="font-semibold">{{ todayLog.break }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Balance</p>
                <p class="font-semibold text-red-400">{{ todayLog.balance }}</p>
              </div>
            </div>
          </div>

          <!-- Monthly Summary -->
          <div>
            <h4 class="text-lg font-medium mb-4">This month</h4>
            
            <!-- Total Hours -->
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <!-- 🔴 DYNAMIC: Monthly hours from API -->
                <p class="text-lg font-semibold">{{ monthlyStats.totalHours }} h</p>
                <p class="text-gray-400 text-sm">{{ monthlyStats.totalScheduled }}</p>
              </div>
            </div>

            <!-- Progress Bars -->
            <div class="space-y-4">
              <!-- 🔴 DYNAMIC: Progress bars with calculated percentages from API -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Worked time</span>
                  <span>{{ monthlyStats.workedTime }}</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    :style="{ width: monthlyStats.workedProgress + '%' }"
                  ></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Shortage time</span>
                  <span>{{ monthlyStats.shortageTime }}</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                    :style="{ width: monthlyStats.shortageProgress + '%' }"
                  ></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Over time</span>
                  <span>{{ monthlyStats.overTime }}</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-blue-300 h-2 rounded-full transition-all duration-300" 
                    :style="{ width: monthlyStats.overTimeProgress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Punch In Dialog -->
    <div 
      v-if="showPunchInDialog" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showPunchInDialog = false"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold mb-4">Punch In Confirmation</h3>
        <p class="text-gray-300 mb-6">
          Are you sure you want to punch in for today?
        </p>
        <div class="flex gap-4 justify-end">
          <button 
            @click="showPunchInDialog = false"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmPunchIn"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
          >
            Punch In
          </button>
        </div>
      </div>
    </div>

    <!-- Punch Out Dialog -->
    <div 
      v-if="showPunchOutDialog" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showPunchOutDialog = false"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold mb-4">Punch Out Confirmation</h3>
        <p class="text-gray-300 mb-6">
          Are you sure you want to punch out? This will end your work session.
        </p>
        <div class="flex gap-4 justify-end">
          <button 
            @click="showPunchOutDialog = false"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmPunchOut"
            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
          >
            Punch Out
          </button>
        </div>
      </div>
    </div>

    <!-- Break Timer Dialog -->
    <div 
      v-if="showBreakDialog" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeBreakDialog"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <h3 class="text-xl font-semibold mb-4">Break Timer</h3>
          
          <!-- Break Timer Display -->
          <div class="mb-6">
            <div class="text-4xl font-mono font-bold text-blue-400 mb-2">
              {{ formatTime(breakDuration) }}
            </div>
            <p class="text-gray-400">Break duration</p>
          </div>

          <!-- Break Status -->
          <div class="mb-6">
            <div class="flex items-center justify-center gap-2 mb-2">
              <div :class="[
                'w-3 h-3 rounded-full',
                isOnBreak ? 'bg-red-500 animate-pulse' : 'bg-green-500'
              ]"></div>
              <span class="text-sm">
                {{ isOnBreak ? 'Currently on break' : 'Break ended' }}
              </span>
            </div>
            <p class="text-gray-400 text-sm">
              {{ isOnBreak ? 'Break started at ' + breakStartTime : 'Break ended at ' + breakEndTime }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 justify-center">
            <button 
              @click="closeBreakDialog"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button 
              @click="toggleBreak"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                isOnBreak ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              ]"
            >
              {{ isOnBreak ? 'End Break' : 'Start Break' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 🔴 DYNAMIC: All these reactive data sources should come from API calls
const employeeName = ref(null)
const timezone = ref('Asia/Bangkok')
const currentTime = ref('1:40 PM')
const timeOfDay = ref('Afternoon')
const isEarly = ref(true)
const arrivalStatus = ref(null)

// 🔴 DYNAMIC: Punch times from attendance API
const punchInTime = ref(null)
const punchOutTime = ref(null)

// Dialog states
const showPunchInDialog = ref(false)
const showPunchOutDialog = ref(false)
const showBreakDialog = ref(false)

// Break timer states
const isOnBreak = ref(false)
const breakStartTime = ref('')
const breakEndTime = ref('')
const breakDuration = ref(0)
let breakTimer = null

// 🔴 DYNAMIC: Leave statistics from HR API
const leaveStats = ref({
  totalAllowance: '19.17',
  paidAllowance: '13.33',
  unpaidAllowance: '5.84',
  totalTaken: '1',
  paidTaken: '0',
  unpaidTaken: '1',
  totalAvailable: '18.17',
  paidAvailable: '13.33',
  unpaidAvailable: '4.84'
})

// 🔴 DYNAMIC: Leave requests from API
const leaveRequests = ref({
  pending: '0',
  paidPending: '0',
  unpaidPending: '0'
})

// 🔴 DYNAMIC: Time tracking data from API
const todayLog = ref({
  scheduled: '09:00',
  worked: '06:46',
  break: '01:00',
  balance: '-2:13'
})

// 🔴 DYNAMIC: Monthly statistics from API
const monthlyStats = ref({
  totalHours: '196',
  totalScheduled: 'Total schedule time',
  workedTime: '167 h and 36 m',
  workedProgress: 85,
  shortageTime: '28 h and 23 m',
  shortageProgress: 15,
  overTime: '2 h and 36 m',
  overTimeProgress: 5
})


// Separate methods for punch in and punch out
const confirmPunchIn = async () => {
  try {
    const response = await $fetch('http://127.0.0.1:8000/api/punch-in', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    punchInTime.value = formatApiTime(response.punch_in)
    punchOutTime.value = null // Reset punch out time for new session
    showPunchInDialog.value = false
    console.log('Punch in successful:', response)
    
    // Refresh today's data after punch action
    await fetchTodayAttendance()
  } catch (error) {
    console.error('Punch in failed:', error)
    alert('Punch in failed. Please try again.')
  }
}

const confirmPunchOut = async () => {
  try {
    const response = await $fetch('http://127.0.0.1:8000/api/punch-out', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    punchOutTime.value = formatApiTime(response.punch_out)
    showPunchOutDialog.value = false
    console.log('Punch out successful:', response)
    
    // Refresh today's data after punch action
    await fetchTodayAttendance()
  } catch (error) {
    console.error('Punch out failed:', error)
    alert('Punch out failed. Please try again.')
  }
}

const handleBreakToggle = () => {
  if (isOnBreak.value) {
    // If already on break, show dialog to end break
    showBreakDialog.value = true
  } else {
    // If not on break, show dialog to start break
    showBreakDialog.value = true
  }
}

const toggleBreak = async () => {
  try {
    if (isOnBreak.value) {
      // End break
      await endBreak()
    } else {
      // Start break
      await startBreak()
    }
  } catch (error) {
    console.error('Break toggle failed:', error)
    alert('Break action failed. Please try again.')
  }
}

const startBreak = async () => {
  try {
    // 🔴 API CALL: POST /api/attendance/start-break
    const response = await $fetch('http://127.0.0.1:8000/api/start-break', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    isOnBreak.value = true
    breakStartTime.value = formatApiTime(response.break_start)
    breakDuration.value = 0
    
    // Start timer
    breakTimer = setInterval(() => {
      breakDuration.value++
    }, 1000)
    
    console.log('Break started successfully:', response)
    
    // Refresh today's data
    await fetchTodayAttendance()
  } catch (error) {
    console.error('Start break failed:', error)
    throw error
  }
}

const endBreak = async () => {
  try {
    // 🔴 API CALL: POST /api/attendance/end-break
    const response = await $fetch('http://127.0.0.1:8000/api/end-break', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    isOnBreak.value = false
    breakEndTime.value = formatApiTime(response.break_end)
    
    // Stop timer
    if (breakTimer) {
      clearInterval(breakTimer)
      breakTimer = null
    }
    
    console.log('Break ended successfully:', response)
    
    // Refresh today's data
    await fetchTodayAttendance()
  } catch (error) {
    console.error('End break failed:', error)
    throw error
  }
}

const closeBreakDialog = () => {
  showBreakDialog.value = false
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

const formatApiTime = (timestamp) => {
  if (!timestamp) return null
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  })
}

// 🔴 API INTEGRATION: Fetch today's attendance data
const fetchTodayAttendance = async () => {
  try {
    const response = await $fetch('http://127.0.0.1:8000/api/today', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Update attendance data from API response
    if (response.punch_in) {
      punchInTime.value = formatApiTime(response.punch_in)
    }
    
    if (response.punch_out) {
      punchOutTime.value = formatApiTime(response.punch_out)
    }

    if (response.user_name) {
      employeeName.value = response.user_name
    }
    
    // Update break status
    if (response.break_start && !response.break_end) {
      isOnBreak.value = true
      breakStartTime.value = formatApiTime(response.break_start)
      
      // Calculate break duration if currently on break
      const breakStart = new Date(response.break_start)
      const now = new Date()
      breakDuration.value = Math.floor((now - breakStart) / 1000)
      
      // Start timer if not already running
      if (!breakTimer) {
        breakTimer = setInterval(() => {
          breakDuration.value++
        }, 1000)
      }
    } else if (response.break_end) {
      isOnBreak.value = false
      breakEndTime.value = formatApiTime(response.break_end)
      
      // Calculate total break duration for the day
      if (response.break_start) {
        const breakStart = new Date(response.break_start)
        const breakEnd = new Date(response.break_end)
        breakDuration.value = Math.floor((breakEnd - breakStart) / 1000)
      }
    }
    
    // Calculate arrival status
    if (response.punch_in) {
      const punchIn = new Date(response.punch_in)
      const scheduledTime = new Date()
      scheduledTime.setHours(9, 0, 0, 0) // Assuming 9 AM scheduled time
      
      const diffMs = scheduledTime - punchIn
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      
      if (diffMinutes > 0) {
        isEarly.value = true
        const hours = Math.floor(diffMinutes / 60)
        const minutes = diffMinutes % 60
        if (hours > 0) {
          arrivalStatus.value = `You came ${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''} early today!`
        } else {
          arrivalStatus.value = `You came ${minutes} minute${minutes > 1 ? 's' : ''} early today!`
        }
      } else if (diffMinutes < 0) {
        isEarly.value = false
        const lateMins = Math.abs(diffMinutes)
        const hours = Math.floor(lateMins / 60)
        const minutes = lateMins % 60
        if (hours > 0) {
          arrivalStatus.value = `You are ${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''} late today.`
        } else {
          arrivalStatus.value = `You are ${minutes} minute${minutes > 1 ? 's' : ''} late today.`
        }
      } else {
        arrivalStatus.value = 'You arrived right on time today!'
      }
    }
    
    console.log('Today attendance data loaded:', response)
  } catch (error) {
    console.error('Failed to fetch today attendance:', error)
  }
}

// 🔴 LIFECYCLE: Fetch data on component mount
onMounted(async () => {
  try {
    // Fetch today's attendance data first
    await fetchTodayAttendance()
    updateCurrentTime()
    setInterval(updateCurrentTime, 1000)
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})

// Clean up timers on unmount
onUnmounted(() => {
  if (breakTimer) {
    clearInterval(breakTimer)
    breakTimer = null
  }
})

const updateCurrentTime = () => {
  const now = new Date()
  const options = { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true,
    timeZone: 'Asia/Bangkok'
  }
  currentTime.value = now.toLocaleTimeString('en-US', options)
  
  const hour = now.getHours()
  if (hour < 12) {
    timeOfDay.value = 'Morning'
  } else if (hour < 18) {
    timeOfDay.value = 'Afternoon'
  } else {
    timeOfDay.value = 'Evening'
  }
}
</script>