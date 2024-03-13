<template>
  <div class="p-20 container mx-auto">
    <p class="flex font-bold text-3xl mb-8">활동 스트림</p>

    <div class="relative mb-12">
      <div v-for="(post, index) in postList" class="border shadow-xl p-6 bg-neutral-50">
        <div class="flex flex-col gap-x-6 mb-1">
          <p class="text-2xl font-semibold flex-grow">TITLE: {{ post.title }}</p>
          <p class="text-sm font-medium mr-10 text-right">{{ post._id }}</p>
        </div>
        <div class="mb-2 p-1 border-t mx-2 border-neutral-200"></div>

        <div class="content" v-html="post.html"></div>
      </div>
      
    </div>
  </div>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'; // useAuth composable import

const authStore = useAuthStore()
const postList = ref([])
const accessToken = ref()
const BASE_URL = useRuntimeConfig().public.api_url;

async function getPosts() {
  try {
    const response = await fetch(`${BASE_URL}/course/my_post_list`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
      method: 'GET',
    });
    const data = await response.json();
    const sortedPosts = data.sort((a, b) => {
      return new Date(b._id) - new Date(a._id);
    });

    postList.value = sortedPosts;
  } catch (error) {
    console.error(error);
  }
}

async function handleLogout() {

  await authStore.logout();

}

onMounted(async() => {
  accessToken.value = authStore.getTokenFromLocalStorage();
  await getPosts();
})


</script>

<style>
.content {
    font-size: 14px;
}
.content h1 {
    font-size: 20px; /* 원하는 크기로 설정 */
}

.content h2 {
    font-size: 18px; /* 원하는 크기로 설정 */
}

.content h3 {
    font-size: 16px; /* 원하는 크기로 설정 */
}

.content p {
  font-size: 14px;
}
</style>