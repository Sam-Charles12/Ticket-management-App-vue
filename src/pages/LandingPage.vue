<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  ArrowRight,
  CheckCircle2,
  Ticket,
  Zap,
  Users,
  BarChart3,
  Shield,
  Clock,
} from "lucide-vue-next";

import AppButton from "@/components/ui/Button.vue";
import CardRoot from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Create and manage tickets in seconds with our intuitive interface.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign tickets to team members and track progress together.",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description: "Get insights into ticket trends and team performance.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Stay informed with instant notifications and updates.",
  },
  {
    icon: CheckCircle2,
    title: "Smart Automation",
    description: "Automate repetitive tasks and focus on what matters.",
  },
];

const benefits = [
  "Unlimited tickets and team members",
  "Priority support and training",
  "Advanced reporting and analytics",
  "Custom workflows and automation",
  "API access for integrations",
  "99.9% uptime guarantee",
];

const router = useRouter();

const handleGetStarted = () => {
  router.push({ name: "register" });
};

const handleLogin = () => {
  router.push({ name: "login" });
};
</script>

<template>
  <div class="min-h-screen overflow-hidden">
    <section
      class="relative bg-linear-to-br from-blue-600 to-blue-800 text-white"
    >
      <div
        class="absolute top-10 right-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"
      />
      <div
        class="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl"
      />
      <div
        class="absolute top-1/2 left-1/3 h-32 w-32 rounded-full border-4 border-white/20"
      />

      <div class="relative mx-auto w-full max-w-[1440px] px-4 py-20 md:py-32">
        <div class="mx-auto max-w-4xl text-center">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 shadow-lg backdrop-blur-sm"
          >
            <Ticket class="h-4 w-4" />
            <span class="text-sm">Trusted by 10,000+ teams worldwide</span>
          </div>

          <h1 class="mb-6 text-white">
            The Modern Way to
            <br />
            <span class="text-blue-200">Manage Support Tickets</span>
          </h1>

          <p class="mb-8 text-xl text-blue-100">
            Streamline your support workflow, collaborate with your team, and
            deliver exceptional customer service with TicketFlow.
          </p>

          <div
            class="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <AppButton
              size="lg"
              class="gap-2 bg-white text-blue-600 hover:bg-blue-50"
              @click="handleGetStarted"
            >
              Get Started Free
              <ArrowRight class="h-4 w-4" />
            </AppButton>
            <AppButton
              size="lg"
              variant="outline"
              class="border-white bg-transparent text-white hover:bg-white/10"
              @click="handleLogin"
            >
              Login
            </AppButton>
          </div>

          <p class="mt-4 text-sm text-blue-200">
            No credit card required • Free 14-day trial
          </p>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
        <svg
          class="relative block h-[60px] w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>

    <section class="bg-white py-20">
      <div class="mx-auto w-full max-w-[1440px] px-4">
        <div class="mb-12 text-center">
          <h2 class="mb-4">Everything You Need</h2>
          <p class="text-xl text-gray-600">
            Powerful features to help you manage tickets efficiently
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardRoot
            v-for="feature in features"
            :key="feature.title"
            class="rounded-2xl border-2 shadow-lg transition-all hover:border-blue-200 hover:shadow-xl"
          >
            <CardContent class="p-6">
              <div
                class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 shadow-md"
              >
                <component :is="feature.icon" class="h-7 w-7 text-blue-600" />
              </div>
              <h3 class="mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </CardContent>
          </CardRoot>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-20">
      <div class="mx-auto w-full max-w-[1440px] px-4">
        <div class="rounded-3xl bg-white p-8 shadow-xl md:p-12">
          <div class="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 class="mb-6">
                Why Teams Choose
                <br />
                TicketFlow
              </h2>
              <p class="mb-8 text-lg text-gray-600">
                Join thousands of teams who have transformed their support
                workflow with our comprehensive ticket management solution.
              </p>
              <AppButton size="lg" class="gap-2" @click="handleGetStarted">
                Start Your Free Trial
                <ArrowRight class="h-4 w-4" />
              </AppButton>
            </div>

            <div class="space-y-4">
              <div
                v-for="benefit in benefits"
                :key="benefit"
                class="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
              >
                <div
                  class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100"
                >
                  <CheckCircle2 class="h-4 w-4 text-green-600" />
                </div>
                <p class="text-lg">{{ benefit }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-20">
      <div class="mx-auto w-full max-w-[1440px] px-4">
        <CardRoot
          class="rounded-3xl border-blue-600 bg-linear-to-br from-blue-600 to-blue-800 text-white shadow-2xl"
        >
          <CardContent class="p-12 text-center">
            <h2 class="mb-4 text-white">Ready to Get Started?</h2>
            <p class="mb-8 text-xl text-blue-100">
              Join thousands of teams managing their tickets with TicketFlow
            </p>
            <div
              class="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <AppButton
                size="lg"
                class="gap-2 bg-white text-blue-600 hover:bg-blue-50"
              >
                Get Started
                <ArrowRight class="h-4 w-4" />
              </AppButton>
              <AppButton
                size="lg"
                variant="outline"
                class="border-white bg-transparent text-white hover:bg-white/10"
              >
                Login
              </AppButton>
            </div>
          </CardContent>
        </CardRoot>
      </div>
    </section>
  </div>
</template>
