import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { useSyncExternalStore } from "react";

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
});

export function useSession() {
  const store = authClient.useSession;
  return useSyncExternalStore(
    (callback) => store.listen(callback),
    () => store.get(),
    () => store.get(),
  );
}
