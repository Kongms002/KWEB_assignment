import { defineStore } from 'pinia';


export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const BASE_URL = useRuntimeConfig().public.api_url;

    function saveTokenToLocalStorage(accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    function getTokenFromLocalStorage() {
        return localStorage.getItem('accessToken');
    }

    async function login(username, password) {
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (data.access_token) {
                saveTokenToLocalStorage(data.access_token);
                verify();
                navigateTo('/');
            } else {
                throw new Error(data.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
            throw new Error('로그인 요청 중 오류가 발생했습니다.');
        }
    }

    async function register(username, password, name, _id, grant) {
      try {
        const response = await $fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, name, _id, grant }),
        });
        navigateTo('/login')
      } catch (error) {
        throw new Error('회원가입 요청 중 오류가 발생했습니다.');
      }
    }

    async function logout() {
        localStorage.removeItem('accessToken');
        user.value = null;
        navigateTo('/login');
    }

    async function verify() {
        const accessToken = getTokenFromLocalStorage();
        if (accessToken != 'undefined') {
            try {
                const response = await $fetch(`${BASE_URL}/auth/verify`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                user.value = response.user;
                navigateTo('/')
            } catch (error) {
                navigateTo('/login')
                console.log(error)
                throw new Error('서버 인증에 실패했습니다.');

            }
        } else {
            user.value = null;
            navigateTo('/login')
            throw new Error('접근 토큰이 없습니다.');
        }
    }

    return {
        user,
        login,
        register,
        logout,
        verify,
        getTokenFromLocalStorage,
    };
})
