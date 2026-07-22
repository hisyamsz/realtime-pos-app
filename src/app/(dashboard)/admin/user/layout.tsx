import { ReactNode } from 'react';

export default function UserAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage system users and their roles.
        </p>
      </div>
      {children}
    </div>
  );
}
