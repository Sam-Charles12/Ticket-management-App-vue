<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { AlertCircle, Ticket } from "lucide-vue-next";
import { toast } from "vue-sonner";

import AppAlert from "@/components/ui/Alert.vue";
import AlertDescription from "@/components/ui/AlertDescription.vue";
import AppButton from "@/components/ui/Button.vue";
import AppCard from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import CardDescription from "@/components/ui/CardDescription.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import AppInput from "@/components/ui/Input.vue";
import AppLabel from "@/components/ui/Label.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errorMessage = ref("");
const isSubmitting = ref(false);

const isShortPassword = computed(
  () => form.password.length > 0 && form.password.length < 6
);

const passwordsMismatch = computed(
  () =>
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword
);

const resetError = () => {
  errorMessage.value = "";
};

const validate = () => {
  if (form.password !== form.confirmPassword) {
    errorMessage.value = "Passwords do not match";
    return false;
  }

  if (form.password.length < 6) {
    errorMessage.value = "Password must be at least 6 characters";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  resetError();

  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const success = await authStore.register(
      form.name,
      form.email,
      form.password
    );

    if (success) {
      toast.success("Account created successfully!", {
        description: "Welcome to TicketFlow.",
      });
      await router.push({ name: "dashboard" });
      return;
    }

    errorMessage.value = "Registration failed. Please try again.";
    toast.error("Registration failed", {
      description: "Unable to create account. Please try again.",
    });
  } catch (error) {
    console.error(error);
    errorMessage.value = "An unexpected error occurred. Please try again.";
    toast.error("Registration error", {
      description: "An unexpected error occurred.",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleNavigate = (name: string) => {
  router.push({ name });
};
</script>

<template>
  <div
    class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12"
  >
    <div class="mx-auto w-full max-w-[1440px]">
      <div class="mx-auto w-full max-w-md">
        <div class="mb-8 text-center">
          <div
            class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white"
          >
            <Ticket class="h-7 w-7" />
          </div>
          <h1 class="mb-2 text-3xl font-semibold text-foreground">
            Create Your Account
          </h1>
          <p class="text-gray-600">Get started with TicketFlow today</p>
        </div>

        <AppCard class="rounded-2xl shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle class="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Create a new account to start managing tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <AppAlert v-if="errorMessage" variant="destructive">
                <AlertCircle class="h-4 w-4" />
                <AlertDescription>{{ errorMessage }}</AlertDescription>
              </AppAlert>

              <div class="space-y-2">
                <AppLabel for="name" class="mb-[5px]">
                  Full Name <span class="text-red-500">*</span>
                </AppLabel>
                <AppInput
                  id="name"
                  v-model="form.name"
                  type="text"
                  placeholder="John Doe"
                  :disabled="isSubmitting"
                  class="border border-gray-200 bg-white shadow-sm"
                  required
                />
              </div>

              <div class="space-y-2">
                <AppLabel for="register-email" class="mb-[5px]">
                  Email <span class="text-red-500">*</span>
                </AppLabel>
                <AppInput
                  id="register-email"
                  v-model="form.email"
                  type="email"
                  placeholder="name@example.com"
                  :disabled="isSubmitting"
                  class="border border-gray-200 bg-white shadow-sm"
                  required
                />
              </div>

              <div class="space-y-2">
                <AppLabel for="register-password" class="mb-[5px]">
                  Password <span class="text-red-500">*</span>
                </AppLabel>
                <AppInput
                  id="register-password"
                  v-model="form.password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  :disabled="isSubmitting"
                  class="border border-gray-200 bg-white shadow-sm"
                  required
                />
                <p v-if="isShortPassword" class="text-sm text-amber-600">
                  Password must be at least 6 characters
                </p>
              </div>

              <div class="space-y-2">
                <AppLabel for="register-confirm-password" class="mb-[5px]">
                  Confirm Password <span class="text-red-500">*</span>
                </AppLabel>
                <AppInput
                  id="register-confirm-password"
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  :disabled="isSubmitting"
                  class="border border-gray-200 bg-white shadow-sm"
                  required
                />
                <p v-if="passwordsMismatch" class="text-sm text-amber-600">
                  Passwords do not match
                </p>
              </div>

              <AppButton type="submit" class="w-full bg-black text-white cursor-pointer " :disabled="isSubmitting">
                {{ isSubmitting ? "Creating account..." : "Create Account" }}
              </AppButton>

              <div class="text-center text-sm text-gray-600">
                Already have an account?
                <button
                  type="button"
                  class="text-blue-600 transition-colors hover:underline"
                  @click="handleNavigate('login')"
                >
                  Sign in
                </button>
              </div>
            </form>
          </CardContent>
        </AppCard>
      </div>
    </div>
  </div>
</template>
