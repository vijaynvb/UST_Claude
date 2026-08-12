import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

const OPENAPI_SPEC_PATH = join(__dirname, '..', '..', '..', 'openapi.yaml');

export function loadOpenApiSpec(): Record<string, unknown> {
  const raw = readFileSync(OPENAPI_SPEC_PATH, 'utf-8');
  return load(raw) as Record<string, unknown>;
}
