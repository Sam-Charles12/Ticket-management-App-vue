<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: ClassValue;
  for?: string;
}>();

const classes = computed(() =>
  cn(
    "text-sm font-medium text-foreground",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    props.class
  )
);
</script>

<template>
  <label :for="props.for" :class="classes" data-slot="label">
    <slot />
  </label>
</template>
