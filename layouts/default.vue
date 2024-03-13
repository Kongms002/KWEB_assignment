<template>
  <div>
      <Logo></Logo>

      <NavBar></NavBar>
      <slot />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.verify();
})
</script>