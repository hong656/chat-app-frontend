<template>
    <div class="flex items-center justify-between h-20 px-24">
        <div class="text-4xl font-bold">Razzi.</div>
        <div class="text-lg font-bold">
        <div class="flex justify-between link">
            <NuxtLink
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.link"
            class="nav-link"
            :class="{ 'active': $route.path === item.link }"
            >
            {{ item.name }}
            </NuxtLink>
        </div>
        </div>
    </div>
</template>

<script>
export default {
data() {
    return {
    menuItems: [
        { name: "Home", link: "/" },
        { name: "Dashboard", link: "/dashboard" },
        { name: "Log out", link: "" },
        { name: "Welcome to dasboard page", link: "" },
    ],
    };
},
};
</script>

<style scoped>
.nav-link {
text-decoration: none;
--text-color: #ffffff
transition: color 0.3s;
}
.nav-link:hover {
color: orange;
}
.nav-link.active {
color: orange;
font-weight: bolder;
}
.link {
width: 800px;
}
</style>