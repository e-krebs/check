import type { BasicSourceMapConsumer, IndexedSourceMapConsumer } from 'source-map';
import { type SourceFile } from 'typescript';

import { type DefaultLine, type Line } from 'utils/Line';
import { parseChild } from './parseChild';

export const parseTestFile = (
  file: SourceFile,
  sourceMap: BasicSourceMapConsumer | IndexedSourceMapConsumer
): Line[] =>
  (parseChild(file, file, sourceMap) as DefaultLine)?.items ?? [];
