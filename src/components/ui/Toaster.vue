<script setup lang="ts">
import type { ToasterProps } from "vue-sonner";
import { Toaster as SonnerToaster } from "vue-sonner";

const props = withDefaults(defineProps<Partial<ToasterProps>>(), {
  position: "top-right",
  theme: "light",
});

const styleOverrides = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
} as const;
</script>

<template>
  <SonnerToaster class="toaster group" v-bind="props" :style="styleOverrides" />
</template>
