<script setup lang="ts">
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const props = withDefaults(
  defineProps<{
    variant?: VariantProps<typeof alertVariants>["variant"];
    class?: ClassValue;
  }>(),
  {
    variant: "default",
  }
);

const classes = computed(() =>
  cn(alertVariants({ variant: props.variant }), props.class)
);
</script>

<template>
  <div :class="classes" data-slot="alert" role="alert">
    <slot />
  </div>
</template>
