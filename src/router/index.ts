import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("@/pages/LandingPage.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/LoginPage.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/pages/RegisterPage.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/pages/DashboardPage.vue"),
    },
    {
      path: "/tickets",
      name: "tickets",
      component: () => import("@/pages/TicketsPage.vue"),
    },
    {
      path: "/tickets/new",
      name: "ticket-create",
      component: () => import("@/pages/TicketFormPage.vue"),
    },
    {
      path: "/tickets/:id",
      name: "ticket-detail",
      component: () => import("@/pages/TicketDetailPage.vue"),
      props: true,
    },
    {
      path: "/tickets/:id/edit",
      name: "ticket-edit",
      component: () => import("@/pages/TicketFormPage.vue"),
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
