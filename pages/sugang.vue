<template>
  <div class="p-20 container mx-auto">
    <p class="flex font-bold text-3xl mb-8">수강 강의 목록</p>
    <div v-for="(course, index) in courseList" class="border shadow-xl p-6 bg-neutral-100">
      <div class="flex items-center justify-between w-full h-full">
        <div>
          <p class="text-lg font-semibold">{{ course.name }}</p>
          <p class="text-sm font-medium">{{ course._id }}</p>
        </div>
        <button class="hover:opacity-70 shadow-xl shadow-black/20 px-2 py-1 text-sm font-semibold border bg-rose-700 text-white rounded-lg" @click="sugang(course._id)">신청</button>
      </div>
        
      </div>
  </div>



</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const BASE_URL = useRuntimeConfig().public.api_url;
const authStore = useAuthStore();
const accessToken = ref()
const courseList = ref([])
const message = ref('')

async function getCourses() {
  try {
    const response = await fetch(`${BASE_URL}/course/course_list`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
      method: 'GET',
    });
    
    const data = await response.json();
    courseList.value = data;
  } catch (error) {
    console.error(error);
  }
}

async function sugang (id) {
  try {
    const response = await fetch(`${BASE_URL}/course/${id}/sugang`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
      method: 'POST',
    });
    if (response.status == 200) {
      alert("수강신청 완료");
    } else if (response.status == 400) {
      alert("이미 신청한 강의입니다.");
    }
    
    } catch (error) {
    console.log(error.status);
  }
}
onMounted(async () => {
  accessToken.value = authStore.getTokenFromLocalStorage();
  await getCourses();
})

</script>