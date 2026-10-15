#!/usr/bin/env node
/**
 * Gera tipos TypeScript a partir do OpenAPI público da API de produto, via
 * openapi-typescript. Por padrão lê o spec servido pela API em produção;
 * COFFEEMAIL_OPENAPI_SPEC aponta para outro arquivo local ou URL.
 *
 * Uso:
 *   node scripts/generate-types.mjs
 *   COFFEEMAIL_OPENAPI_SPEC=./product.json node scripts/generate-types.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import openapiTS, { astToString } from 'openapi-typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_SPEC_URL = 'https://api.coffeemail.com.br/v1/product/docs/json';

const OUTPUT_PATH = resolve(__dirname, '../src/generated/openapi.d.ts');

const main = async () => {
  const specArg = process.env.COFFEEMAIL_OPENAPI_SPEC || DEFAULT_SPEC_URL;
  const input = /^https?:\/\//.test(specArg)
    ? new URL(specArg)
    : readFileSync(resolve(specArg), 'utf8');

  const ast = await openapiTS(input);
  const output = astToString(ast);

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, output);
  console.log(`[generate-types] wrote ${OUTPUT_PATH}`);
};

main().catch((err) => {
  console.error('[generate-types] failed:', err);
  process.exit(1);
});
