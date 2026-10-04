#!/usr/bin/env node
/**
 * Gera tipos TypeScript a partir do OpenAPI da API (openapi/product.json em
 * coffee-mail-api), via openapi-typescript.
 *
 * coffee-mail-api, coffee-mail-sdk e coffee-mail-web são repositórios
 * independentes — ainda NÃO existe uma forma definitiva de distribuir o
 * spec entre eles (candidatos: pacote npm versionado, fetch de uma URL
 * publicada, etc). Por enquanto este script lê o arquivo do diretório
 * irmão no disco, o que só funciona em checkout local e é um placeholder
 * até essa decisão ser tomada.
 *
 * Uso:
 *   node scripts/generate-types.mjs
 *   COFFEEMAIL_OPENAPI_SPEC=https://api.coffeemail.com.br/v1/product/docs/json node scripts/generate-types.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import openapiTS, { astToString } from 'openapi-typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_LOCAL_SPEC = resolve(
  __dirname,
  '../../coffee-mail-api/openapi/product.json'
);

const OUTPUT_PATH = resolve(__dirname, '../src/generated/openapi.d.ts');

const main = async () => {
  const specArg = process.env.COFFEEMAIL_OPENAPI_SPEC;

  let input;
  if (specArg) {
    input = /^https?:\/\//.test(specArg) ? new URL(specArg) : resolve(specArg);
  } else {
    if (!existsSync(DEFAULT_LOCAL_SPEC)) {
      console.error(
        `[generate-types] no spec found at ${DEFAULT_LOCAL_SPEC} and ` +
          `COFFEEMAIL_OPENAPI_SPEC is not set. Run "npm run openapi:export" ` +
          `in coffee-mail-api first, or point COFFEEMAIL_OPENAPI_SPEC at a ` +
          `reachable spec URL/path.`
      );
      process.exit(1);
    }
    console.warn(
      `[generate-types] COFFEEMAIL_OPENAPI_SPEC not set — falling back to ` +
        `sibling checkout path ${DEFAULT_LOCAL_SPEC}. This only works ` +
        `locally; CI needs a real distribution mechanism.`
    );
    input = pathToFileURL(DEFAULT_LOCAL_SPEC);
  }

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
