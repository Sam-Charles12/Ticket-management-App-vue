<script setup lang="ts">
import { RouterView } from "vue-router";

import AppFooter from "@/components/layout/Footer.vue";
import AppHeader from "@/components/layout/Header.vue";
import AppToaster from "@/components/ui/Toaster.vue";
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <AppToaster position="top-right" />
  </div>
</template>
