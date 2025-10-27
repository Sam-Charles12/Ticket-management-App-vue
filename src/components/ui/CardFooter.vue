<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = defineProps<{ class?: ClassValue }>();

const classes = computed(() =>
  cn("flex items-center px-6 pb-6 [.border-t]:pt-6", props.class)
);
</script>

<template>
  <div :class="classes" data-slot="card-footer">
    <slot />
  </div>
</template>
