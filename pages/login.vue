<template>
  <div class="pb-24 ">
    <div class="container mx-auto shadow-black shadow-2xl bg-white mt-12 p-20">
      <p class="font-semibold text-2xl text-black mb-12">LOGIN</p>
      <label class="font-semibold text-sm text-neutral-800 pb-1 block"
        >아이디</label>
      <input
      v-model="username"
      type="text"
      class="shadow-inner border rounded px-3 py-2 mt-1 mb-5 text-sm w-full"
      />
      <label class="font-semibold text-sm text-neutral-800 pb-1 block"
          >비밀번호</label>
      <input
          v-model="password"
          type="password"
          class="shadow-inner border rounded px-3 py-2 mt-1 mb-5 text-sm w-full"
      />
      <button
        @click="submitLogin"
        type="button"
        class="transition duration-200 shadow-black/30 bg-red-600 hover:bg-red-400 shadow-lg focus:bg-red-900 focus:shadow-sm focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block mb-3"
      >
        <span class="inline-block mr-2">로그인</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-4 h-4 inline-block"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
      <div class="justify-self-end">
        <nuxt-link to="/register" class="text-xs font-semibold">
          회원가입하기
        </nuxt-link>
      </div>
      
    </div>
    
  </div>



</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const username = ref()
const password = ref()

const authStore = useAuthStore()


async function submitLogin() {
  authStore.login(username.value, password.value)
}

onMounted(async () => {
  await authStore.verify();
})
</script>