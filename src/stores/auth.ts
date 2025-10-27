import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email || !password) {
      return false;
    }

    const derivedName = email.split("@")[0] ?? email;

    user.value = {
      id: "1",
      email,
      name: derivedName,
      role: email.includes("admin") ? "admin" : "user",
    } satisfies User;

    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!name || !email || !password) {
      return false;
    }

    user.value = {
      id: Date.now().toString(),
      email,
      name,
      role: "user",
    } satisfies User;

    return true;
  };

  const logout = () => {
    user.value = null;
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
});
