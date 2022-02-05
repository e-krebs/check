import type { BasicSourceMapConsumer, IndexedSourceMapConsumer } from 'source-map';
import type { SourceFile, Node } from 'typescript';

export const getOriginalLine = (
  node: Node,
  file: SourceFile,
  sourceMap: BasicSourceMapConsumer | IndexedSourceMapConsumer
): number | null => {
  const { line: sourceMapLine, character: sourceMapColumn } =
    file.getLineAndCharacterOfPosition(node.pos);
  const { line: originalLine } =
    sourceMap.originalPositionFor({ line: sourceMapLine + 1, column: sourceMapColumn });
  return originalLine ? originalLine + 1 : null;
};
