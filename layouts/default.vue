<template>
    <div class="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200">
        <div class="flex">
            <Sidebar />
            <main class="flex-1">
                <Header>
                    <template #right>
                        <ColorModeToggle />
                    </template>
                </Header>
                <div class="p-8">
                    <NuxtPage />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
// The color mode module will automatically handle the dark mode classes
</script>






