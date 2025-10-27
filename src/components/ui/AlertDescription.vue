<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = defineProps<{ class?: ClassValue }>();

const classes = computed(() =>
  cn(
    "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
    props.class
  )
);
</script>

<template>
  <div :class="classes" data-slot="alert-description">
    <slot />
  </div>
</template>
