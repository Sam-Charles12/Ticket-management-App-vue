<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = defineProps<{ class?: ClassValue }>();

const classes = computed(() => cn("px-6 [&:last-child]:pb-6", props.class));
</script>

<template>
  <div :class="classes" data-slot="card-content">
    <slot />
  </div>
</template>
