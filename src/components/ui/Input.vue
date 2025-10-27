<script setup lang="ts">
import { computed } from "vue";
import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    class?: ClassValue;
    type?: string;
  }>(),
  {
    modelValue: "",
    type: "text",
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number | null): void;
}>();

const classes = computed(() =>
  cn(
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    props.class
  )
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <input
    :value="props.modelValue ?? ''"
    :class="classes"
    :type="props.type"
    data-slot="input"
    @input="handleInput"
    v-bind="$attrs"
  />
</template>
