
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url'; // Added for ES module compatibility

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.LLAMA_API_ENDPOINT': JSON.stringify(env.LLAMA_API_ENDPOINT),
        'process.env.LLAMA_API_KEY': JSON.stringify(env.LLAMA_API_KEY) 
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});