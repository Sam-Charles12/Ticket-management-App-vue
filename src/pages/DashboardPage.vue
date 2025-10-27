<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Ticket as TicketIcon,
  TrendingUp,
} from "lucide-vue-next";

import AppButton from "@/components/ui/Button.vue";
import AppCard from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import { default as Badge } from "@/components/ui/Badge.vue";
import { useAuthStore } from "@/stores/auth";
import { type Ticket, useTicketStore } from "@/stores/tickets";

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const { tickets } = storeToRefs(ticketStore);

const recentTickets = computed(() => tickets.value.slice(0, 5));

const totalTickets = computed(() => tickets.value.length);
const openTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === "open").length
);
const inProgressTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === "in_progress").length
);
const closedTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === "closed").length
);
const criticalTickets = computed(
  () => tickets.value.filter((ticket) => ticket.priority === "critical").length
);

const statusClasses: Record<Ticket["status"], string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  closed: "bg-gray-100 text-gray-700",
};

const priorityClasses: Record<Ticket["priority"], string> = {
  low: "border-green-500 text-green-700",
  medium: "border-yellow-500 text-yellow-700",
  high: "border-orange-500 text-orange-700",
  critical: "border-red-500 text-red-700",
};

const formatStatus = (status: Ticket["status"]) =>
  status
    .replace("_", " ")
    .replace(/\b\w/g, (match: string) => match.toUpperCase());

const formatPriority = (priority: Ticket["priority"]) =>
  priority.charAt(0).toUpperCase() + priority.slice(1);

const statusClass = (status: Ticket["status"]) =>
  statusClasses[status] ?? "bg-gray-100 text-gray-700";

const priorityClass = (priority: Ticket["priority"]) =>
  priorityClasses[priority] ?? "border-gray-500 text-gray-700";

const formatDate = (value: Date) => new Date(value).toLocaleDateString();

const navigateTo = (name: string, id?: string) => {
  router.push({
    name,
    params: id ? { id } : undefined,
  });
};
</script>

<template>
  <section class="bg-gray-50 py-8">
    <div class="mx-auto w-full max-w-[1440px] px-4">
      <div
        class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="mb-2 text-3xl font-semibold text-foreground">
            Welcome back, {{ authStore.user?.name ?? "Guest" }}! 👋
          </h1>
          <p class="text-gray-600">
            Here's what's happening with your tickets today.
          </p>
        </div>
      </div>

      <div class="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AppCard class="rounded-2xl shadow-lg">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Total Tickets</CardTitle>
            <TicketIcon class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-semibold text-foreground">
              {{ totalTickets }}
            </div>
            <p class="mt-1 text-xs text-gray-500">All time</p>
          </CardContent>
        </AppCard>

        <AppCard class="rounded-2xl shadow-lg">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle class="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-semibold text-foreground">
              {{ openTickets }}
            </div>
            <p class="mt-1 text-xs text-gray-500">Awaiting assignment</p>
          </CardContent>
        </AppCard>

        <AppCard class="rounded-2xl shadow-lg">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">In Progress</CardTitle>
            <Clock class="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-semibold text-foreground">
              {{ inProgressTickets }}
            </div>
            <p class="mt-1 text-xs text-gray-500">Being worked on</p>
          </CardContent>
        </AppCard>

        <AppCard class="rounded-2xl shadow-lg">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Closed</CardTitle>
            <CheckCircle2 class="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-semibold text-foreground">
              {{ closedTickets }}
            </div>
            <p class="mt-1 text-xs text-gray-500">Completed items</p>
          </CardContent>
        </AppCard>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <AppCard class="rounded-2xl shadow-lg lg:col-span-2">
          <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle class="text-xl">Recent Tickets</CardTitle>
            <AppButton
              variant="ghost"
              size="sm"
              class="gap-1"
              @click="navigateTo('tickets')"
            >
              View All
              <TrendingUp class="h-4 w-4" />
            </AppButton>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-if="recentTickets.length === 0"
                class="flex flex-col items-center justify-center py-12 text-center"
              >
                <TicketIcon class="mb-4 h-12 w-12 text-gray-300" />
                <h3 class="mb-2 text-lg font-semibold text-foreground">
                  No tickets yet
                </h3>
                <p class="mb-4 text-gray-600">
                  Create your first ticket to get started
                </p>
                <AppButton @click="navigateTo('ticket-create')">
                  Create Ticket
                </AppButton>
              </div>

              <div
                v-for="ticket in recentTickets"
                v-else
                :key="ticket.id"
                class="flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                @click="navigateTo('ticket-detail', ticket.id)"
              >
                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-2">
                    <h4
                      class="line-clamp-1 text-base font-semibold text-foreground"
                    >
                      {{ ticket.title }}
                    </h4>
                  </div>
                  <p class="line-clamp-2 text-sm text-gray-600">
                    {{ ticket.description }}
                  </p>
                  <div class="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      :class="statusClass(ticket.status)"
                    >
                      {{ formatStatus(ticket.status) }}
                    </Badge>
                    <Badge
                      variant="outline"
                      :class="priorityClass(ticket.priority)"
                    >
                      {{ formatPriority(ticket.priority) }}
                    </Badge>
                  </div>
                </div>
                <div class="text-right text-sm text-gray-500">
                  <p>{{ formatDate(ticket.updatedAt) }}</p>
                  <p class="text-xs">{{ ticket.assignee }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </AppCard>

        <div class="space-y-6">
          <AppCard class="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle class="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <AppButton
                class="w-full justify-start gap-2"
                @click="navigateTo('ticket-create')"
              >
                <TicketIcon class="h-4 w-4" />
                Create New Ticket
              </AppButton>
              <AppButton
                variant="outline"
                class="w-full justify-start gap-2"
                @click="navigateTo('tickets')"
              >
                <TrendingUp class="h-4 w-4" />
                View All Tickets
              </AppButton>
            </CardContent>
          </AppCard>

          <AppCard
            v-if="criticalTickets > 0"
            class="rounded-2xl border-red-200 bg-red-50 shadow-lg"
          >
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-red-700">
                <AlertCircle class="h-5 w-5" />
                Critical Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-red-700">
                You have {{ criticalTickets }} critical
                {{ criticalTickets === 1 ? "ticket" : "tickets" }} that requires
                immediate attention.
              </p>
              <AppButton
                variant="destructive"
                class="mt-4 w-full"
                @click="navigateTo('tickets')"
              >
                View Critical Tickets
              </AppButton>
            </CardContent>
          </AppCard>

          <AppCard class="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle class="text-lg">Ticket Overview</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div
                class="flex items-center justify-between text-sm text-gray-600"
              >
                <span>Open</span>
                <span class="text-blue-600 font-medium">{{ openTickets }}</span>
              </div>
              <div
                class="flex items-center justify-between text-sm text-gray-600"
              >
                <span>In Progress</span>
                <span class="text-yellow-600 font-medium">{{
                  inProgressTickets
                }}</span>
              </div>
              <div
                class="flex items-center justify-between text-sm text-gray-600"
              >
                <span>Closed</span>
                <span class="text-green-600 font-medium">{{
                  closedTickets
                }}</span>
              </div>
            </CardContent>
          </AppCard>
        </div>
      </div>
    </div>
  </section>
</template>
