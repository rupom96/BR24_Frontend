import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Every bare specifier the app imports must be pre-bundled up front.
    // If Vite discovers one late it re-runs the optimizer mid page load, and
    // the browser ends up mixing two optimizer generations of the MUI chunks
    // -> "Uncaught TypeError: styled_default is not a function".
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/material/styles',
      '@mui/material/Backdrop',
      '@mui/material/Box',
      '@mui/material/Button',
      '@mui/material/Fade',
      '@mui/material/FormControlLabel',
      '@mui/material/FormGroup',
      '@mui/material/Modal',
      '@mui/material/Stack',
      '@mui/material/Switch',
      '@mui/material/Tooltip',
      '@mui/material/Typography',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers/AdapterDayjs',
      '@mui/x-date-pickers/DatePicker',
      '@mui/x-date-pickers/LocalizationProvider',
      '@mui/x-tree-view/SimpleTreeView',
      '@mui/x-tree-view/TreeItem',
      'material-react-table',
    ],
  },
  resolve: {
    dedupe: ['@mui/material'],
  },
});
