'use client';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { store } from '@/store';
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <Provider store={store}>
        {children}
      </Provider>
    </ThemeProvider>
  );
}
