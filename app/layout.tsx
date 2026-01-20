"use client";

import { ThemeProvider, createGlobalStyle } from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactNode } from "react";

import { theme } from "../styles/theme";
import { AccordionProvider } from "../context/AccordionContext";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider theme={theme}>
          <AccordionProvider>
            <GlobalStyle />
            {children}
            <ToastContainer
              position="top-right"
              autoClose={2500}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="dark"
            />
          </AccordionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
