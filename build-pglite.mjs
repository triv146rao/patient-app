// build-pglite.mjs
import { build } from '@electric-sql/pglite';

await build({ out: 'public' });

console.log('✅ pglite.wasm and pglite.data built successfully!');
