<script setup lang="ts">
import { computed } from "vue";
import { Github, Linkedin, Mail, Ticket } from "lucide-vue-next";

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class="bg-gray-50 border-t border-gray-200 shadow-lg">
    <div class="mx-auto w-full max-w-[1440px] px-4 py-12">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="mb-4 flex items-center gap-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"
            >
              <Ticket class="h-5 w-5" />
            </div>
            <span class="text-xl font-semibold text-foreground"
              >TicketFlow</span
            >
          </div>
          <p class="text-sm text-gray-600">
            The modern way to manage support tickets and deliver exceptional
            customer service.
          </p>
        </div>

        <div>
          <h4 class="mb-4 text-foreground">Product</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                href="#"
                class="text-gray-600 transition-colors hover:text-blue-600"
                >Features</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 transition-colors hover:text-blue-600"
                >Pricing</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 transition-colors hover:text-blue-600"
                >FAQ</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 transition-colors hover:text-blue-600"
                >Documentation</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h4 class="mb-4 text-foreground">Company</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                href="#"
                class="text-gray-600 transition-colors hover:text-blue-600"
                >About Us</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 transition-colors hover:text-blue-600"
                >Careers</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 transition-colors hover:text-blue-600"
                >Blog</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 transition-colors hover:text-blue-600"
                >Contact</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h4 class="mb-4 text-foreground">Connect</h4>
          <div class="flex gap-3">
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
              <Mail class="h-5 w-5" />
            </a>
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
              <Github class="h-5 w-5" />
            </a>
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
              <Linkedin class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-8">
        <div
          class="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 sm:flex-row border-y border-gray-200 py-6"
        >
          <p>© {{ currentYear }} TicketFlow. All rights reserved.</p>
          <div class="flex gap-6">
            <a href="#" class="transition-colors hover:text-blue-600"
              >Privacy Policy</a
            >
            <a href="#" class="transition-colors hover:text-blue-600"
              >Terms of Service</a
            >
            <a href="#" class="transition-colors hover:text-blue-600"
              >Cookie Policy</a
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
