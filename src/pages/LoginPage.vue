<script setup lang="ts">
import { reactive, ref } from "vue";
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
  email: "",
  password: "",
});

const errorMessage = ref("");
const isSubmitting = ref(false);

const handleSubmit = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    const success = await authStore.login(form.email, form.password);

    if (success) {
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      await router.push({ name: "dashboard" });
      return;
    }

    errorMessage.value = "Invalid email or password";
    toast.error("Login failed", {
      description: "Please check your credentials and try again.",
    });
  } catch (error) {
    console.error(error);
    errorMessage.value = "An unexpected error occurred. Please try again.";
    toast.error("Login error", {
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
    class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 px-4 py-12"
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
            Welcome Back
          </h1>
          <p class="text-gray-600">Sign in to your account to continue</p>
        </div>

        <AppCard class="rounded-2xl shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle class="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <AppAlert v-if="errorMessage" variant="destructive">
                <AlertCircle class="h-4 w-4" />
                <AlertDescription>{{ errorMessage }}</AlertDescription>
              </AppAlert>

              <div class="space-y-2">
                <AppLabel for="email">
                  Email <span class="text-red-500">*</span>
                </AppLabel>
                <AppInput
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="name@example.com"
                  :disabled="isSubmitting"
                  required
                  :class="[
                    errorMessage && !form.email
                      ? 'border-red-500'
                      : 'border-gray-300',
                    'bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-0',
                  ]"
                />
              </div>

              <div class="space-y-2">
                <AppLabel for="password">
                  Password <span class="text-red-500">*</span>
                </AppLabel>
                <AppInput
                  id="password"
                  v-model="form.password"
                  type="password"
                  placeholder="Enter your password"
                  :disabled="isSubmitting"
                  required
                  :class="[
                    errorMessage && !form.email
                      ? 'border-red-500'
                      : 'border-gray-300',
                    'bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-0',
                  ]"
                />
              </div>

              <AppButton type="submit" class="w-full bg-black text-white" :disabled="isSubmitting">
                {{ isSubmitting ? "Signing in..." : "Sign In" }}
              </AppButton>

              <div class="text-center text-sm text-gray-600">
                Don't have an account?
                <button
                  type="button"
                  class="text-blue-600 transition-colors hover:underline"
                  @click="handleNavigate('register')"
                >
                  Sign up
                </button>
              </div>

              <div
                class="rounded-lg bg-blue-50 p-3 text-left text-sm text-blue-900"
              >
                <p class="mb-1 font-medium">Demo credentials:</p>
                <p class="text-xs">Email: any valid email</p>
                <p class="text-xs">Password: any password</p>
                <p class="mt-1 text-xs text-blue-700">
                  Tip: Use "admin@example.com" to log in as admin
                </p>
              </div>
            </form>
          </CardContent>
        </AppCard>
      </div>
    </div>
  </div>
</template>
