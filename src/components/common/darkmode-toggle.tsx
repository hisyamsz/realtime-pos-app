'use client';

import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DarkmodeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="group relative h-10 w-10 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-accent data-[state=open]:-translate-y-0.5 data-[state=open]:shadow-md data-[state=open]:bg-accent active:translate-y-0 active:scale-95"
        >
          <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-data-[state=open]:scale-110">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 space-y-1 p-1.5">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`cursor-pointer gap-2.5 rounded-md px-2.5 py-2 font-medium transition-colors ${
            theme === 'light' ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Sun className="h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`cursor-pointer gap-2.5 rounded-md px-2.5 py-2 font-medium transition-colors ${
            theme === 'dark' ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Moon className="h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`cursor-pointer gap-2.5 rounded-md px-2.5 py-2 font-medium transition-colors ${
            theme === 'system' ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Laptop className="h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



