<script setup lang="ts">
interface Props {
  id?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <section class="py-16">
    <div class="mx-auto w-full max-w-[1440px] px-4">
      <div
        class="rounded-xl border bg-card p-12 text-center text-muted-foreground"
      >
        <h2 class="text-2xl font-semibold text-foreground">
          {{ props.id ? "Edit Ticket" : "Create Ticket" }}
        </h2>
        <p class="mt-2 text-sm">
          The ticket form will be migrated soon. Ticket ID:
          <span class="font-medium text-foreground">{{
            props.id ?? "new"
          }}</span>
        </p>
      </div>
    </div>
  </section>
</template>
