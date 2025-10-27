<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  CalendarDays,
  Eye,
  PencilLine,
  Plus,
  Search,
  User,
  X,
} from "lucide-vue-next";

import AppBadge from "@/components/ui/Badge.vue";
import AppButton from "@/components/ui/Button.vue";
import AppCard from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import {
  useTicketStore,
  type TicketPriority,
  type TicketStatus,
} from "@/stores/tickets";

const router = useRouter();
const ticketStore = useTicketStore();
const { tickets } = storeToRefs(ticketStore);

type StatusFilter = "all" | TicketStatus;
type PriorityFilter = "all" | TicketPriority;

const statusFilter = ref<StatusFilter>("all");
const priorityFilter = ref<PriorityFilter>("all");
const searchQuery = ref("");

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  closed: "Closed",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const priorityBadgeClasses: Record<TicketPriority, string> = {
  low: "border border-green-200 bg-green-50 text-green-700",
  medium: "border border-yellow-200 bg-yellow-50 text-yellow-700",
  high: "border border-orange-200 bg-orange-50 text-orange-700",
  critical: "border border-red-200 bg-red-50 text-red-700",
};

const statusBadgeClasses: Record<TicketStatus, string> = {
  open: "bg-green-100 text-green-700",
  in_progress: "bg-amber-100 text-amber-700",
  closed: "bg-gray-100 text-gray-700",
};

const sortedTickets = computed(() =>
  [...tickets.value].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
);

const filteredTickets = computed(() =>
  sortedTickets.value.filter((ticket) => {
    const matchesStatus =
      statusFilter.value === "all" || ticket.status === statusFilter.value;
    const matchesPriority =
      priorityFilter.value === "all" ||
      ticket.priority === priorityFilter.value;

    if (!matchesStatus || !matchesPriority) {
      return false;
    }

    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return (
      ticket.title.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      ticket.assignee.toLowerCase().includes(query)
    );
  })
);

const statusCounts = computed(() =>
  tickets.value.reduce(
    (acc, ticket) => {
      acc.total += 1;
      acc[ticket.status] += 1;
      return acc;
    },
    { total: 0, open: 0, in_progress: 0, closed: 0 } as Record<
      "total" | TicketStatus,
      number
    >
  )
);

const hasActiveFilters = computed(
  () =>
    statusFilter.value !== "all" ||
    priorityFilter.value !== "all" ||
    searchQuery.value.trim().length > 0
);

const handleCreate = () => {
  router.push({ name: "ticket-create" });
};

const handleView = (id: string) => {
  router.push({ name: "ticket-detail", params: { id } });
};

const handleEdit = (id: string) => {
  router.push({ name: "ticket-edit", params: { id } });
};

const resetFilters = () => {
  statusFilter.value = "all";
  priorityFilter.value = "all";
  searchQuery.value = "";
};

const formatDate = (value: Date) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusFilterOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "open", label: statusLabels.open },
  { value: "in_progress", label: statusLabels.in_progress },
  { value: "closed", label: statusLabels.closed },
];

const priorityFilterOptions: Array<{ value: PriorityFilter; label: string }> = [
  { value: "all", label: "All priorities" },
  { value: "low", label: priorityLabels.low },
  { value: "medium", label: priorityLabels.medium },
  { value: "high", label: priorityLabels.high },
  { value: "critical", label: priorityLabels.critical },
];

const getStatusCount = (value: StatusFilter) =>
  value === "all" ? statusCounts.value.total : statusCounts.value[value];
</script>

<template>
  <section class="py-16">
    <div class="mx-auto w-full max-w-[1440px] px-4">
      <div
        class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-3xl font-semibold text-foreground">Tickets</h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Manage your support queue, filter by status or priority, and jump
            into any ticket.
          </p>
        </div>
        <AppButton class="gap-2 bg-black cursor-pointer text-white" @click="handleCreate">
          <Plus class="h-4 w-4" />
          New Ticket
        </AppButton>
      </div>

      <div
        class="mb-8 flex flex-col gap-4 rounded-2xl bg-transparent md:flex-row md:items-center md:justify-between"
      >
        <p class="text-sm text-muted-foreground">
          Showing {{ filteredTickets.length }} of {{ statusCounts.total }}
          {{ statusCounts.total === 1 ? "ticket" : "tickets" }}
        </p>
        <div class="flex flex-wrap items-center gap-2 md:justify-end">
          <AppButton
            v-for="option in statusFilterOptions"
            :key="option.value"
            variant="outline"
            size="sm"
            class="rounded-full border border-border bg-white/90 px-4 capitalize text-sm font-medium text-muted-foreground shadow-sm backdrop-blur"
            :class="
              statusFilter === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                : ''
            "
            @click="statusFilter = option.value"
          >
            {{ option.label }}
            <span class="ml-2 text-xs text-muted-foreground/80">
              {{ getStatusCount(option.value) }}
            </span>
          </AppButton>

          <div class="hidden h-5 w-px bg-border md:block" aria-hidden="true" />

          <select
            v-model="priorityFilter"
            class="h-9 rounded-full border border-border bg-white/90 px-4 text-sm text-foreground shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-blue-500 focus-visible:ring-blue-200/60 focus-visible:ring-[3px]"
          >
            <option
              v-for="option in priorityFilterOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <div class="relative w-full min-w-[220px] sm:w-auto">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search tickets"
              class="h-9 w-full rounded-full border border-border bg-white/90 pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-blue-500 focus-visible:ring-blue-200/60 focus-visible:ring-[3px]"
            />
          </div>

          <AppButton
            v-if="hasActiveFilters"
            variant="ghost"
            size="sm"
            class="rounded-full text-sm text-muted-foreground hover:text-foreground"
            @click="resetFilters"
          >
            <X class="h-4 w-4" />
            Clear
          </AppButton>
        </div>
      </div>

      <div
        v-if="filteredTickets.length === 0"
        class="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center"
      >
        <h3 class="text-lg font-semibold text-foreground">No tickets found</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or create a new ticket to get started.
        </p>
        <AppButton class="mt-6 gap-2 bg-black text-white" @click="handleCreate">
          <Plus class="h-4 w-4" />
          Create Ticket
        </AppButton>
      </div>

      <div v-else class="grid gap-5 lg:grid-cols-3">
        <AppCard
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          class="flex flex-col justify-between rounded-2xl border border-gray-200 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <CardHeader class="space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <AppBadge
                variant="secondary"
                :class="statusBadgeClasses[ticket.status]"
              >
                {{ statusLabels[ticket.status] }}
              </AppBadge>
              <AppBadge
                variant="secondary"
                :class="priorityBadgeClasses[ticket.priority]"
              >
                {{ priorityLabels[ticket.priority] }} Priority
              </AppBadge>
            </div>
            <CardTitle class="text-xl text-foreground">
              {{ ticket.title }}
            </CardTitle>
            <p
              class="text-sm leading-relaxed text-muted-foreground line-clamp-3"
            >
              {{ ticket.description }}
            </p>
          </CardHeader>
          <CardContent class="space-y-6">
            <div
              class="flex gap-3 flex-col text-sm text-muted-foreground sm:grid-cols-2"
            >
              <div class="flex items-center gap-2">
                <User class="h-4 w-4" />
                <div>
                  <!-- <p
                    class="text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    Assignee
                  </p> -->
                  <p class="text-foreground">{{ ticket.assignee }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <CalendarDays class="h-4 w-4" />
                <div>
                  <!-- <p
                    class="text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    Updated
                  </p> -->
                  <p class="text-foreground">
                    {{ formatDate(ticket.updatedAt) }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <!-- <p class="text-xs text-muted-foreground">
                Created {{ formatDate(ticket.createdAt) }} • Ticket ID #{{
                  ticket.id
                }}
              </p> -->
              <div class="flex w-full gap-2">
                <AppButton
                  size="sm"
                  variant="outline"
                  class="gap-2 border flex-1 cursor-pointer hover:bg-gray-100 transition border-gray-200"
                  @click="handleView(ticket.id)"
                >
                  <Eye class="h-4 w-4" />
                  View
                </AppButton>
                <AppButton
                  size="sm"
                  class="gap-2 text-blac border cursor-pointer hover:bg-gray-100 transition border-gray-200"
                  @click="handleEdit(ticket.id)"
                >
                  <PencilLine class="h-4 w-4" />
                  <!-- Edit -->
                </AppButton>
              </div>
            </div>
          </CardContent>
        </AppCard>
      </div>
    </div>
  </section>
</template>
