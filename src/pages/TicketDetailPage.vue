<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Trash2,
  User,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

import AppButton from "@/components/ui/Button.vue";
import AppCard from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import CardFooter from "@/components/ui/CardFooter.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import AppBadge from "@/components/ui/Badge.vue";
import { useTicketStore, type TicketStatus } from "@/stores/tickets";

interface Props {
  id?: string;
}

const props = defineProps<Props>();

const router = useRouter();
const ticketStore = useTicketStore();

const ticket = computed(() =>
  props.id ? ticketStore.getTicket(props.id) ?? null : null
);

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  closed: "Closed",
};

const statusBadgeClasses = (status: TicketStatus) => {
  if (status === "open") {
    return "bg-green-100 text-green-700";
  }
  if (status === "in_progress") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-gray-100 text-gray-700";
};

const priorityBadgeClasses = (priority: string) => {
  switch (priority) {
    case "critical":
      return "border border-red-200 bg-red-50 text-red-700";
    case "high":
      return "border border-orange-200 bg-orange-50 text-orange-700";
    case "medium":
      return "border border-yellow-200 bg-yellow-50 text-yellow-700";
    case "low":
      return "border border-green-200 bg-green-50 text-green-700";
    default:
      return "border border-gray-200 bg-gray-50 text-gray-700";
  }
};

const formatDateTime = (value: Date) => value.toLocaleString();

const handleBack = () => {
  router.push({ name: "tickets" });
};

const handleEdit = () => {
  if (!props.id) {
    return;
  }
  router.push({ name: "ticket-edit", params: { id: props.id } });
};

const handleDelete = () => {
  if (!props.id) {
    return;
  }

  try {
    ticketStore.deleteTicket(props.id);
    toast.success("Ticket deleted", {
      description: "The ticket has been removed from the system.",
    });
    router.push({ name: "tickets" });
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete ticket", {
      description: "An unexpected error occurred. Please retry.",
    });
  }
};
</script>

<template>
  <section class="py-16">
    <div class="mx-auto w-full max-w-[1440px] px-4">
      <div class="mb-6">
        <AppButton variant="ghost" class="gap-2" @click="handleBack">
          <ArrowLeft class="h-4 w-4" />
          Back to Tickets
        </AppButton>
      </div>

      <template v-if="ticket">
        <AppCard class="rounded-2xl shadow-xl">
          <CardHeader>
            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div class="flex-1">
                <div class="mb-3 flex flex-wrap gap-2">
                  <AppBadge
                    variant="secondary"
                    :class="statusBadgeClasses(ticket.status)"
                  >
                    {{ statusLabels[ticket.status] }}
                  </AppBadge>
                  <AppBadge
                    variant="secondary"
                    :class="priorityBadgeClasses(ticket.priority)"
                  >
                    {{ ticket.priority }} priority
                  </AppBadge>
                </div>
                <CardTitle class="text-2xl">{{ ticket.title }}</CardTitle>
              </div>
              <div class="flex gap-2">
                <AppButton
                  variant="outline"
                  size="sm"
                  class="gap-2"
                  @click="handleEdit"
                >
                  <Edit class="h-4 w-4" />
                  Edit
                </AppButton>
                <AppButton
                  variant="outline"
                  size="sm"
                  class="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  @click="handleDelete"
                >
                  <Trash2 class="h-4 w-4" />
                  Delete
                </AppButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div>
                <h3 class="mb-2 text-lg font-semibold text-foreground">
                  Description
                </h3>
                <p class="text-sm text-muted-foreground whitespace-pre-wrap">
                  {{ ticket.description }}
                </p>
              </div>

              <div class="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 class="mb-4 text-lg font-semibold text-foreground">
                    Ticket Information
                  </h3>
                  <div class="space-y-3 text-sm text-muted-foreground">
                    <div class="flex items-start gap-3">
                      <User class="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p>Assigned to</p>
                        <p class="text-foreground">{{ ticket.assignee }}</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <User class="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p>Created by</p>
                        <p class="text-foreground">{{ ticket.createdBy }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="mb-4 text-lg font-semibold text-foreground">
                    Timestamps
                  </h3>
                  <div class="space-y-3 text-sm text-muted-foreground">
                    <div class="flex items-start gap-3">
                      <Calendar class="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p>Created</p>
                        <p class="text-foreground">
                          {{ formatDateTime(ticket.createdAt) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <Clock class="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p>Last updated</p>
                        <p class="text-foreground">
                          {{ formatDateTime(ticket.updatedAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="mb-4 text-lg font-semibold text-foreground">
                  Activity Timeline
                </h3>
                <div class="space-y-4">
                  <div class="flex gap-4">
                    <div class="flex flex-col items-center">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100"
                      >
                        <div class="h-3 w-3 rounded-full bg-green-600"></div>
                      </div>
                      <div class="w-0.5 flex-1 bg-muted"></div>
                    </div>
                    <div class="flex-1 pb-4">
                      <p class="text-sm text-muted-foreground">
                        Ticket updated to
                        <AppBadge
                          variant="secondary"
                          :class="statusBadgeClasses(ticket.status)"
                        >
                          {{ statusLabels[ticket.status] }}
                        </AppBadge>
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {{ formatDateTime(ticket.updatedAt) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex gap-4">
                    <div class="flex flex-col items-center">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100"
                      >
                        <div class="h-3 w-3 rounded-full bg-blue-600"></div>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-muted-foreground">
                        Ticket created by {{ ticket.createdBy }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {{ formatDateTime(ticket.createdAt) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter
            class="flex flex-col items-start gap-2 border-t border-dashed border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
          >
            <span>Ticket ID: {{ ticket.id }}</span>
            <span>Priority: {{ ticket.priority }}</span>
          </CardFooter>
        </AppCard>
      </template>

      <template v-else>
        <AppCard class="rounded-2xl shadow-xl">
          <CardContent class="flex flex-col items-center justify-center py-16">
            <AlertCircle class="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 class="mb-2 text-xl font-semibold text-foreground">
              Ticket Not Found
            </h2>
            <p class="mb-6 text-sm text-muted-foreground">
              The ticket you are trying to view does not exist or has been
              removed.
            </p>
            <AppButton @click="handleBack">Back to Tickets</AppButton>
          </CardContent>
        </AppCard>
      </template>
    </div>
  </section>
</template>
