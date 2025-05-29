<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-200 mb-8">Attendance Records</h1>
      
      <!-- Table -->
      <div class="bg-gray-800 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-700">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Employee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Punch In</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Punch Out</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Break</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="record in attendanceRecords" :key="record.id" class="hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ formatDate(record.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ record.user_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ formatTime(record.punch_in) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ record.punch_out ? formatTime(record.punch_out) : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs rounded-full font-medium',
                      getStatusClass(record.punch_in)
                    ]"
                  >
                    {{ getStatus(record.punch_in) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ getBreakStatus(record.break_start, record.break_end) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const attendanceRecords = ref([])

// Fetch attendance data
const fetchAttendanceData = async () => {
  try {
    const response = await $fetch('http://127.0.0.1:8000/api/attendance/get')
    attendanceRecords.value = response
  } catch (error) {
    console.error('Failed to fetch attendance data:', error)
  }
}

// Format date to readable format
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Format time to readable format
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return '-'
  const options = { hour: 'numeric', minute: '2-digit', hour12: true }
  return new Date(dateTimeString).toLocaleTimeString('en-US', options)
}

// Get status based on punch-in time
const getStatus = (punchIn) => {
  if (!punchIn) return 'No Record'
  
  const punchInTime = new Date(punchIn)
  const hours = punchInTime.getHours()
  const minutes = punchInTime.getMinutes()
  const totalMinutes = hours * 60 + minutes

  if (totalMinutes < 480) return 'Early'      // Before 8:00
  if (totalMinutes <= 495) return 'Regular'   // Between 8:00 and 8:15
  return 'Late'                               // After 8:15
}

// Get status class for styling
const getStatusClass = (punchIn) => {
  const status = getStatus(punchIn)
  switch (status) {
    case 'Early':
      return 'bg-green-500 text-white'
    case 'Regular':
      return 'bg-blue-500 text-white'
    case 'Late':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

// Get break status
const getBreakStatus = (breakStart, breakEnd) => {
  if (!breakStart && !breakEnd) return 'No Break'
  if (breakStart && !breakEnd) return 'On Break'
  return 'Break Ended'
}

// Fetch data on component mount
onMounted(() => {
  fetchAttendanceData()
})
</script>
