<template>
  <nav>
    <div class="p-5 w-full bg-rose-700 flex items-center justify-between">
      <ul class="flex flex-cols">
        <li 
            v-if="authStore.user?.grant == 'admin'"
            v-for="nav in navAdminList"
            :key="nav.path"
        >
          <nuxt-link :to="nav.path" class="mr-6 block py-2 pr-4 pl-4 md:p-0 font-medium hover:font-bold text-white hover:-translate-y-0.5 hover:scale-105 duration-200">{{
            nav.name
          }}</nuxt-link>
        </li>
        <li 
            v-if="authStore.user?.grant == 'member'"
            v-for="nav in navUserList"
            :key="nav.path"
        >
          <nuxt-link :to="nav.path" class="mr-6 block py-2 pr-4 pl-4 md:p-0 font-medium hover:font-bold text-white hover:-translate-y-0.5 hover:scale-105 duration-200">{{
            nav.name
          }}</nuxt-link>
        </li>
      </ul>
      <button v-if="authStore.user" class="bg-rose-700 hover:opacity-70 text-white font-semibold py-1 px-2 rounded-lg ml-auto" @click="handleLogout">로그아웃</button>
    </div>
  </nav>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

async function handleLogout() {

  await authStore.logout();

}

const navUserList = [
  {
    path: "/",
    name: "STREAM",
  },
  {
    path: "/course",
    name: "COURSE",
  },
  {
    path: "/sugang",
    name: "SUGANG",
  },

]

const navAdminList = [
  {
    path: "/",
    name: "STREAM",
  },
  {
    path: "/course",
    name: "COURSE",
  },
  // {
  //   path: "/new",
  //   name: "MANAGE",
  // },
]



</script>

<style scoped>
.router-link-active {
  color: #f4f8bb;
  font-weight: 800;
}
</style>