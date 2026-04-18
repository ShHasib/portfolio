import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";

export interface AuthState {
  principal: Principal | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { identity, isAuthenticated, isLoggingIn, login, clear } =
    useInternetIdentity();

  const principal = identity?.getPrincipal() ?? null;

  return {
    principal: principal as Principal | null,
    isAuthenticated,
    isLoading: isLoggingIn,
    login,
    logout: clear,
  };
}
