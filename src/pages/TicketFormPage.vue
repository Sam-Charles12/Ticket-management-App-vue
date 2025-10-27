<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { AlertCircle, ArrowLeft } from "lucide-vue-next";
import { toast } from "vue-sonner";

import AppAlert from "@/components/ui/Alert.vue";
import AlertDescription from "@/components/ui/AlertDescription.vue";
import AppButton from "@/components/ui/Button.vue";
import AppCard from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import AppInput from "@/components/ui/Input.vue";
import AppLabel from "@/components/ui/Label.vue";
import {
  useTicketStore,
  type TicketPriority,
  type TicketStatus,
} from "@/stores/tickets";
import { useAuthStore } from "@/stores/auth";

interface Props {
  id?: string;
}

const props = defineProps<Props>();

const router = useRouter();
const ticketStore = useTicketStore();
const authStore = useAuthStore();

const ticket = computed(() =>
  props.id ? ticketStore.getTicket(props.id) ?? null : null
);

const isEdit = computed(() => Boolean(props.id));

const form = reactive({
  title: "",
  description: "",
  status: "open" as TicketStatus,
  priority: "medium" as TicketPriority,
  assignee: "",
});

watch(
  ticket,
  (value) => {
    if (value) {
      form.title = value.title;
      form.description = value.description;
      form.status = value.status;
      form.priority = value.priority;
      form.assignee = value.assignee;
    }
  },
  { immediate: true }
);

const errors = reactive({
  title: "",
  description: "",
  status: "",
  assignee: "",
  form: "",
});
const isSubmitting = ref(false);

const statusOptions: Array<{ value: TicketStatus; label: string }> = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

const priorityOptions: TicketPriority[] = ["low", "medium", "high", "critical"];

const teamMembers = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Williams",
  "Robert Brown",
  "Emily Davis",
];

const validate = () => {
  errors.title = "";
  errors.description = "";
  errors.status = "";
  errors.assignee = "";
  errors.form = "";

  const trimmedTitle = form.title.trim();
  const trimmedDescription = form.description.trim();

  if (!trimmedTitle) {
    errors.title = "Title is required";
  } else if (trimmedTitle.length > 120) {
    errors.title = "Title must be 120 characters or less";
  }

  if (!trimmedDescription) {
    errors.description = "Description is required";
  } else if (trimmedDescription.length > 2000) {
    errors.description = "Description must be 2000 characters or less";
  }

  if (!statusOptions.some((option) => option.value === form.status)) {
    errors.status = "Status must be Open, In Progress, or Closed";
  }

  if (!form.assignee.trim()) {
    errors.assignee = "Assignee is required";
  }

  return (
    !errors.title && !errors.description && !errors.status && !errors.assignee
  );
};

const handleBack = () => {
  if (isEdit.value && props.id) {
    router.push({ name: "ticket-detail", params: { id: props.id } });
    return;
  }

  router.push({ name: "tickets" });
};

const handleSubmit = async () => {
  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  try {
    if (isEdit.value && props.id) {
      ticketStore.updateTicket(props.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        assignee: form.assignee.trim(),
      });
      toast.success("Ticket updated", {
        description: "Your changes have been saved.",
      });
      router.push({ name: "ticket-detail", params: { id: props.id } });
      return;
    }

    ticketStore.createTicket({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      assignee: form.assignee.trim(),
      createdBy: authStore.user?.email ?? "user@example.com",
    });
    toast.success("Ticket created", {
      description: "The ticket has been added to the list.",
    });
    router.push({ name: "tickets" });
  } catch (error) {
    console.error(error);
    errors.form = "An unexpected error occurred. Please try again.";
    toast.error("Failed to save ticket", {
      description: "An unexpected error occurred. Please retry.",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="py-16">
    <div class="mx-auto w-full max-w-[1440px] px-4">
      <div class="mx-auto max-w-3xl">
        <AppButton variant="ghost" class="mb-6 gap-2" @click="handleBack">
          <ArrowLeft class="h-4 w-4" />
          Back
        </AppButton>

        <template v-if="!ticket && isEdit">
          <AppCard class="rounded-2xl shadow-xl border border-gray-200">
            <CardContent
              class="flex flex-col items-center justify-center py-16"
            >
              <AlertCircle class="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 class="mb-2 text-xl font-semibold text-foreground">
                Ticket Not Found
              </h2>
              <AppButton @click="handleBack">Back to Tickets</AppButton>
            </CardContent>
          </AppCard>
        </template>

        <template v-else>
          <AppCard class="rounded-2xl shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle>{{
                isEdit ? "Edit Ticket" : "Create New Ticket"
              }}</CardTitle>
            </CardHeader>
            <CardContent>
              <form class="space-y-6" @submit.prevent="handleSubmit">
                <AppAlert v-if="errors.form" variant="destructive">
                  <AlertCircle class="h-4 w-4" />
                  <AlertDescription>{{ errors.form }}</AlertDescription>
                </AppAlert>

                <div class="space-y-2">
                  <AppLabel for="title">
                    Title <span class="text-red-500">*</span>
                  </AppLabel>
                    <AppInput
                    id="title"
                    v-model="form.title"
                    placeholder="Enter ticket title"
                    :disabled="isSubmitting"
                    :class="[
                      'block w-full rounded-md border border-gray-300 bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                      errors.title ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200/70' : ''
                    ]"
                  />
                  <p v-if="errors.title" class="text-sm text-red-600">
                    {{ errors.title }}
                  </p>
                </div>

                <div class="space-y-2">
                  <AppLabel for="description">
                    Description <span class="text-red-500">*</span>
                  </AppLabel>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="5"
                    :class="[
                      'block w-full rounded-md border border-gray-300 bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                      errors.description ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200/70' : ''
                    ]"
                    :disabled="isSubmitting"
                  ></textarea>
                  <p v-if="errors.description" class="text-sm text-red-600">
                    {{ errors.description }}
                  </p>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="space-y-2">
                    <AppLabel for="status">
                      Status <span class="text-red-500">*</span>
                    </AppLabel>
                    <select
                      id="status"
                      v-model="form.status"
                        :class="[
                        'block w-full rounded-md border border-gray-300 bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        errors.status ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200/70' : ''
                        ]"
                      :disabled="isSubmitting"
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <p v-if="errors.status" class="text-sm text-red-600">
                      {{ errors.status }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <AppLabel for="priority">Priority</AppLabel>
                    <select
                      id="priority"
                      v-model="form.priority"
                        :class="[
                        'block w-full rounded-md border border-gray-300 bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
                        ]"
                      :disabled="isSubmitting"
                    >
                      <option
                        v-for="option in priorityOptions"
                        :key="option"
                        :value="option"
                      >
                        {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="space-y-2">
                  <AppLabel for="assignee">
                    Assign to <span class="text-red-500">*</span>
                  </AppLabel>
                  <select
                    id="assignee"
                    v-model="form.assignee"
                    :class="[
                      'block w-full rounded-md border border-gray-300 bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                      errors.assignee
                      ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200/70'
                      : ''
                    ]"
                    :disabled="isSubmitting"
                  >
                    <option disabled value="">Select team member</option>
                    <option
                      v-for="member in teamMembers"
                      :key="member"
                      :value="member"
                    >
                      {{ member }}
                    </option>
                  </select>
                  <p v-if="errors.assignee" class="text-sm text-red-600">
                    {{ errors.assignee }}
                  </p>
                </div>

                <div
                  class="flex flex-col space-y-2 gap-3 pt-4 sm:flex-row sm:justify-start"
                >
                <AppButton
                    type="submit"
                    class="bg-black text-white flex-1"
                  :disabled="isSubmitting"
                >
                  {{
                    isSubmitting
                      ? "Saving..."
                      : isEdit
                      ? "Update Ticket"
                      : "Create Ticket"
                  }}
                </AppButton>
                  <AppButton
                    type="button"
                    variant="outline"
                    class="sm:w-auto"
                    @click="handleBack"
                  >
                    Cancel
                  </AppButton>
                </div>
              </form>
            </CardContent>
          </AppCard>
        </template>
      </div>
    </div>
  </section>
</template>
