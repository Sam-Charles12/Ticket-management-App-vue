<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = defineProps<{ class?: ClassValue }>();

const classes = computed(() => cn("text-muted-foreground", props.class));
</script>

<template>
  <p :class="classes" data-slot="card-description">
    <slot />
  </p>
</template>
