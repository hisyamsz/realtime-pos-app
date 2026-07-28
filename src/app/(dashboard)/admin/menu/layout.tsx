import { ReactNode } from 'react';

export default function MenuAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-muted-foreground">Manage system menu items.</p>
      </div>
      {children}
    </div>
  );
}
