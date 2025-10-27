<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = defineProps<{ class?: ClassValue }>();

const classes = computed(() =>
  cn(
    "bg-card text-card-foreground flex flex-col gap-6 rounded-xl",
    props.class
  )
);
</script>

<template>
  <div :class="classes" data-slot="card">
    <slot />
  </div>
</template>
