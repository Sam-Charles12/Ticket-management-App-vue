<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = defineProps<{ class?: ClassValue }>();

const classes = computed(() => cn("leading-none", props.class));
</script>

<template>
  <h4 :class="classes" data-slot="card-title">
    <slot />
  </h4>
</template>
