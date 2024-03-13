<template>
  <div class="p-20 container mx-auto grid grid-cols-3 md:grid-cols-4 md:gap-x-6 gap-x-3">
    <div class="col-span-2 md:col-span-3">
      <p class="flex font-bold text-3xl mb-8">게시글 목록</p>
      <div class="flex justify-between items-center mb-4">
        <button v-if="authStore.user?.grant == 'member'" @click="sugangCancel()" class="bg-rose-700 hover:opacity-70 text-white font-semibold py-1 px-2 rounded-lg">수강취소하기</button>
        <button v-if="authStore.user?.grant == 'admin'" @click="openPostPopup" class="bg-rose-700 hover:opacity-70 text-white font-semibold py-1 px-2 rounded-lg">
            글 작성하기
        </button>
        
      </div>
      <div class="relative mb-10">
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

    <div v-if="authStore.user?.grant == 'admin'">
      <p class="flex font-bold text-2xl mb-9">수강생 목록</p>
      <div v-for="(member, index) in memberList" @mouseenter="showDeleteButton(index)" @mouseleave="showDeleteButton(-1)" class="relative hover:opacity-90 border shadow-xl p-6 bg-neutral-100">
        <div class="flex flex-col gap-x-2">
          <p class="text-lg font-bold flex items-center">{{ member._id }}</p>
          <p class="text-sm font-semibold text-neutral-600 justify-self-end">{{ member.name }}</p>
        </div>
        <button class="absolute px-2 py-1 bottom-3 right-3 text-sm font-semibold text-rose-600 hover:opacity-70 align-left" @click="deleteMember(member._id)" v-if="showDeleteIndex == index">삭제</button>
      </div>
    </div>
    
    <div v-if="isPostPopupOpen" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div  class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg font-bold leading-6 text-gray-900">새 게시글 작성</h3>
                <div class="mt-2">
                  <input v-model="newTitle" type="text" placeholder="제목" class="mb-2 border rounded-md px-3 py-2 w-full">
                  <ClientOnly>
                    <QuillEditor placeholder="글을 입력하세요." content-type="html" ref="editor" v-model:content="newContent" theme="snow" />
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="submitPost" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-700 text-base font-semibold text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm">
              제출
            </button>
            <button @click="closePostPopup" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { useAuthStore } from '@/stores/auth';

import MarkdownIt from 'markdown-it';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';



const BASE_URL = useRuntimeConfig().public.api_url;
const authStore = useAuthStore();
const accessToken = ref()
const postList = ref([])
const memberList = ref([])

const md = new MarkdownIt();
const isPostPopupOpen = ref(false);
const newTitle = ref('')
const newContent = ref('')


const openPostPopup = () => {
  isPostPopupOpen.value = true;
};

const closePostPopup = () => {
  isPostPopupOpen.value = false;
};


const submitPost = async () => {
  try {
    
    const response = await fetch(`${BASE_URL}/course/${useRoute().params.id}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify({ title: newTitle.value, html_content: newContent.value }),
    });
    
    closePostPopup();
    newTitle.value = '';
    newContent.value = '';
    await getPosts();

  } catch (error) {
    console.error(error);
  }
}

const getMembers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/course/${useRoute().params.id}/get_members`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    const data = await response.json();
    memberList.value = data.members;

  } catch (error) {
    console.error(error);
  }
}

const deleteMember = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/course/${useRoute().params.id}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    await getMembers();

  } catch (error) {
    console.error(error);
  }
}

const sugangCancel = async () => {
  try {
    const response = await fetch(`${BASE_URL}/course/${useRoute().params.id}/cancel`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    navigateTo('/course');

  } catch (error) {
    console.error(error);
  }
}

const showDeleteIndex = ref(-1)
const showDeleteButton = (index) => {
  showDeleteIndex.value = index;
}

const getPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/course/${useRoute().params.id}/get_posts`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    const data = await response.json();
    
    // 포스트 리스트를 날짜에 따라 정렬
    const sortedPosts = data.posts.sort((a, b) => {
      return new Date(b._id) - new Date(a._id);
    });

    postList.value = sortedPosts;
    console.log(postList.value)
  } catch (error) {
    console.error(error);
  }
}



onMounted(async () => {
  accessToken.value = authStore.getTokenFromLocalStorage();
  await getPosts();
  if (authStore.user.grant == 'admin') await getMembers();
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