<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = defineProps<{ class?: ClassValue }>();

const classes = computed(() =>
  cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", props.class)
);
</script>

<template>
  <div :class="classes" data-slot="alert-title">
    <slot />
  </div>
</template>
