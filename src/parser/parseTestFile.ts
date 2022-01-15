import { SourceFile } from 'typescript';

import type { Line } from 'utils/Line';
import { parseChild } from './parseChild';

export const parseTestFile = (file: SourceFile): Line[] =>
  parseChild(file, file)?.items ?? [];
