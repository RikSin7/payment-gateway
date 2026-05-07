'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/utils/cn';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  React.useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const CurrentIcon = options.find((opt) => opt.value === theme)?.icon || Sun;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
          "bg-bg-secondary border border-border-primary text-text-secondary",
          "hover:text-text-primary hover:bg-bg-surface"
        )}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 mt-2 w-36 rounded-xl shadow-lg overflow-hidden z-50",
          "bg-bg-surface border border-border-primary",
          "animate-in fade-in zoom-in-95 duration-100"
        )}>
          <div className="p-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                  theme === option.value
                    ? "bg-bg-secondary text-text-primary font-medium"
                    : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                )}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
