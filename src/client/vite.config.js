import { defineConfig } from 'vite'

export default defineConfig({
  // Configuración específica de tu proyecto
  base: './', // Ruta base de tu aplicación
  root: './src', // Ruta raíz de tus archivos fuente
  publicDir: '../public', // Directorio donde se encuentran los archivos públicos
  build: {
    outDir: '../dist' // Directorio de salida para los archivos generados en producción
  }
})
