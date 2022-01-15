import { createSourceFile, ModuleKind, ScriptTarget, transpileModule, type SourceFile } from 'typescript';
import { readFileSync } from 'fs';

import { parseTestFile } from './parseTestFile';
import type { Line } from 'utils/Line';

const target = ScriptTarget.Latest;

export const parse = (path: string): Line[] => {
  const sourceFile = readFileSync(path, 'utf-8');
  const transpiled = transpileModule(
    sourceFile,
    { compilerOptions: { target, module: ModuleKind.CommonJS } }
  );
  const file: SourceFile = createSourceFile('unique.ts', transpiled.outputText, target);
  return parseTestFile(file);
}
