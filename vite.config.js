import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  //cho phép vite sử dụng process.env mặc định thì sẽ sử dụng import.meta.env
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    include: [
      // '@emotion/react',
      // '@emotion/styled',
      // '@mui/material/Tooltip', // hoặc thêm các component bạn dùng như Autocomplete, Popper
      // '@mui/material/Autocomplete',
      // '@mui/base/Popper' // fix lỗi từ Popper nếu cần
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ]
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    svgr()
  ],
  // base: './'
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
