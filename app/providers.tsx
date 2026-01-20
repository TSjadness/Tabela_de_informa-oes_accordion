'use client';

import { ThemeProvider } from 'styled-components';
import { AccordionProvider } from '../context/AccordionContext';
import { theme } from '../styles/theme';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <AccordionProvider>{children}</AccordionProvider>
    </ThemeProvider>
  );
}