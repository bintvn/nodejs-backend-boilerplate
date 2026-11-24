import { generateModule } from './generator.js';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Error: Harap masukkan nama module!');
  console.log('Contoh: npm run generate:module nama-module');
  process.exit(1);
}

generateModule(moduleName).catch((error: unknown) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
