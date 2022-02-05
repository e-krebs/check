import {
  createSourceFile, ModuleKind, ScriptTarget, transpileModule, type SourceFile
} from 'typescript';
import { readFileSync } from 'fs';
import { SourceMapConsumer } from 'source-map';

import { parseTestFile } from './parseTestFile';
import type { Line } from '../utils/Line';

const target = ScriptTarget.Latest;

export const parse = async (path: string): Promise<Line[]> => {
  const sourceFile = readFileSync(path, 'utf-8');
  const transpiled = transpileModule(
    sourceFile,
    {
      compilerOptions: {
        target,
        module: ModuleKind.CommonJS,
        sourceMap: true,
        inlineSources: true
      }
    }
  );
  const file: SourceFile = createSourceFile('unique.ts', transpiled.outputText, target);

  const parsed: Line[] = [];
  if (transpiled.sourceMapText) {
    const sourceMap = await new SourceMapConsumer(transpiled.sourceMapText);
    parsed.push(...parseTestFile(file, sourceMap));
    sourceMap.destroy();
  }

  return parsed;
};
