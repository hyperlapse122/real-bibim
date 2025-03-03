'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/common/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';

export type ThemeDropdownButtonProps = {
  buttonProps?: Omit<React.ComponentProps<typeof Button>, 'children'>;
  menuProps?: Omit<React.ComponentProps<typeof DropdownMenu>, 'children'>;
};

export function ThemeDropdownButton({
  buttonProps,
  menuProps,
}: ThemeDropdownButtonProps) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu {...menuProps}>
      <DropdownMenuTrigger asChild>
        <Button
          {...buttonProps}
          variant={buttonProps?.variant ?? 'outline'}
          size={buttonProps?.size ?? 'icon'}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
