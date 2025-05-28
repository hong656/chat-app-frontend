<template>
    <div class="flex items-center justify-between h-20 px-10 head dark:border-gray-700">        
        <div class="flex-1"></div>
        <div class="flex items-center gap-4">
            <slot name="right"></slot>
            <NuxtLink to="/profile">
                <div class="text-3xl font-bold pfp">
                    P
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
.nav-link {
    text-decoration: none;
    --text-color: #ffffff;
    transition: color 0.3s;
}
.nav-link:hover {
    color: orange;
}
.nav-link.active {
    color: orange;
    font-weight: bolder;
}
.pfp {
    border-radius: 100%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: #896dfb;
}
.link {
    width: 200px;
}
.head {
    border-bottom: 1px solid #e5e7eb;
}
</style>