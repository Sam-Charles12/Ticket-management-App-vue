<template>
  <section class="py-16">
    <div class="mx-auto w-full max-w-[1440px] px-4">
      <div class="mb-8 flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-foreground">Tickets</h2>
      </div>

      <div
        v-if="tickets.length === 0"
        class="rounded-xl border bg-card p-12 text-center text-muted-foreground"
      >
        <p class="mt-2 text-sm">No tickets found.</p>
      </div>

      <ul v-else class="grid grid-cols-1 gap-4">
        <li v-for="ticket in tickets" :key="ticket.id">
          <div class="rounded-xl bg-card p-6">
            <router-link
              :to="{ name: 'ticket-detail', params: { id: ticket.id } }"
              class="text-lg font-medium text-foreground hover:underline"
            >
              {{ ticket.title }}
            </router-link>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ ticket.description }}
            </p>
            <div
              class="mt-3 flex items-center justify-between text-sm text-muted-foreground"
            >
              <div>
                Priority:
                <span class="font-medium text-foreground">{{
                  ticket.priority
                }}</span>
              </div>
              <div>Updated: {{ formatDate(ticket.updatedAt) }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useTicketStore } from "@/stores/tickets";
import { storeToRefs } from "pinia";

const ticketStore = useTicketStore();
const { tickets } = storeToRefs(ticketStore);

const formatDate = (d: string | Date) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString();
};
</script>
