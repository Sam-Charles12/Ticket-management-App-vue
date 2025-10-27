<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LayoutDashboard, LogOut, Plus, Ticket } from "lucide-vue-next";

import AppButton from "@/components/ui/Button.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isMenuOpen = ref(false);
const menuRef = ref<HTMLDivElement | null>(null);

const currentPage = computed(() => (route.name as string | undefined) ?? "");
const userInitials = computed(() => {
  const source = authStore.user?.name ?? authStore.user?.email ?? "";
  return source.slice(0, 2).toUpperCase() || "??";
});

const closeMenu = () => {
  isMenuOpen.value = false;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleGlobalClick = (event: MouseEvent) => {
  if (!isMenuOpen.value) {
    return;
  }

  const target = event.target as Node | null;

  if (menuRef.value && target && !menuRef.value.contains(target)) {
    closeMenu();
  }
};

const navigateTo = async (name: string) => {
  await router.push({ name });
};

const handleLogout = async () => {
  authStore.logout();
  closeMenu();
  await router.push({ name: "landing" });
};

watch(
  () => route.fullPath,
  () => {
    closeMenu();
  }
);

onMounted(() => {
  window.addEventListener("click", handleGlobalClick, { capture: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleGlobalClick, { capture: true });
});
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60 shadow-md"
  >
    <div
      class="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4"
    >
      <div class="flex items-center gap-6">
        <button
          type="button"
          class="flex items-center gap-2"
          @click="
            navigateTo(authStore.isAuthenticated ? 'dashboard' : 'landing')
          "
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"
          >
            <Ticket class="h-5 w-5" />
          </div>
          <span class="text-xl font-semibold text-foreground">TicketFlow</span>
        </button>

        <nav
          v-if="authStore.isAuthenticated"
          class="hidden items-center gap-1 md:flex"
        >
          <AppButton
            variant="ghost"
            class="gap-2"
            :class="{
              'bg-secondary text-secondary-foreground':
                currentPage === 'dashboard',
            }"
            @click="navigateTo('dashboard')"
          >
            <LayoutDashboard class="h-4 w-4" />
            Dashboard
          </AppButton>
          <AppButton
            variant="ghost"
            class="gap-2"
            :class="{
              'bg-secondary text-secondary-foreground':
                currentPage === 'tickets',
            }"
            @click="navigateTo('tickets')"
          >
            <Ticket class="h-4 w-4" />
            Tickets
          </AppButton>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="authStore.isAuthenticated">
          <AppButton class="gap-2" @click="navigateTo('ticket-create')">
            <Plus class="h-4 w-4" />
            <span class="hidden sm:inline">New Ticket</span>
          </AppButton>

          <div ref="menuRef" class="relative">
            <AppButton
              variant="ghost"
              class="h-9 w-9 rounded-full bg-blue-600 text-white"
              @click.stop="toggleMenu"
            >
              <span class="text-sm font-semibold">{{ userInitials }}</span>
            </AppButton>

            <transition name="fade">
              <div
                v-if="isMenuOpen"
                class="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-popover p-3 shadow-xl"
              >
                <div class="mb-3 space-y-1">
                  <p class="text-sm font-medium text-foreground">
                    {{ authStore.user?.name ?? "User" }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ authStore.user?.email }}
                  </p>
                </div>
                <button
                  type="button"
                  class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  @click="handleLogout"
                >
                  <LogOut class="h-4 w-4" />
                  Log out
                </button>
              </div>
            </transition>
          </div>
        </template>

        <template v-else>
          <AppButton variant="ghost" @click="navigateTo('login')"
            >Log in</AppButton
          >
          <AppButton @click="navigateTo('register')">Sign up</AppButton>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
