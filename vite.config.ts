import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import macrosPlugin from 'vite-plugin-babel-macros';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

import path from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros', 'babel-plugin-styled-components'],
      },
    }),
    reactRefresh(),
    macrosPlugin(),
    svgr(),
  ],
  define: {
    'process.platform': JSON.stringify('win32'),
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
