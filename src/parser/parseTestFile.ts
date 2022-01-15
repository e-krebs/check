import { SourceFile } from 'typescript';

import { type DefaultLine, type Line } from 'utils/Line';
import { parseChild } from './parseChild';

export const parseTestFile = (file: SourceFile): Line[] =>
  (parseChild(file, file) as DefaultLine)?.items ?? [];
