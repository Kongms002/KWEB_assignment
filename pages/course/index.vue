<template>
  <div class="p-20 container mx-auto">
    <p class="flex font-bold text-3xl mb-8">강의 목록</p>
    <div class="relative mb-12">
      <div v-for="(course, index) in courseList" class="hover:opacity-60 cursor-pointer border shadow-xl p-6 bg-neutral-100">
        <nuxt-link :to="'course/' + course._id" class="w-full h-full">
          <p class="text-lg font-semibold">{{ course.name }}</p>
          <p class="text-sm font-medium">{{ course._id }}</p>
        </nuxt-link>
        
      </div>
      <nuxt-link to="course/new" v-if="authStore.user?.grant == 'admin'" class="absolute -bottom-8 right-0 cursor-pointer text-white text-sm font-semibold px-2 py-1 shadow-lg rounded-lg font-white hover:opacity-70 bg-rose-700">강의 개설하기</nuxt-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const BASE_URL = useRuntimeConfig().public.api_url;
const authStore = useAuthStore();
const accessToken = ref()
const courseList = ref([])



async function getCourses() {
  try {
    const response = await fetch(`${BASE_URL}/course/my_course_list`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    const data = await response.json();
    courseList.value = data;

  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  accessToken.value = authStore.getTokenFromLocalStorage();
  await getCourses();
});
</script>