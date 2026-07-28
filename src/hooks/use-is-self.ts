import { useAuthStore } from '@/providers/auth-store-provider';

export function useCurrentUserId(): string | undefined {
  return useAuthStore((state) => state.profile?.id || state.user?.id);
}

export function useIsSelf(targetUserId?: string | null): boolean {
  const currentUserId = useCurrentUserId();
  return Boolean(
    currentUserId && targetUserId && targetUserId === currentUserId,
  );
}
