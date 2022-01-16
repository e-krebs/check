import { SyntaxKind, Node, SourceFile } from 'typescript';
import type { BasicSourceMapConsumer, IndexedSourceMapConsumer } from 'source-map';

import type { Line, TestDescriptionLine, TestLine } from 'utils/Line';
import { onlyUnique } from 'utils/onlyUnique';
import { trimChar } from 'utils/trimChar';
import { shortenItems } from './shortenItems';
import { getOriginalLine } from './getOriginalLine';

export const parseChild = (
  node: Node,
  file: SourceFile,
  sourceMap: BasicSourceMapConsumer | IndexedSourceMapConsumer,
): Line | null => {
  const children: Node[] = [];
  node.forEachChild(child => { children.push(child) });

  const code = node.getText(file);

  // // @ts-expect-error
  // console.log(SyntaxKind[node.kind], node.transformFlags, code.split(' ')[0], children.map(child => SyntaxKind[child.kind]));

  switch (node.kind) {
    case SyntaxKind.ImportDeclaration:
    case SyntaxKind.BinaryExpression:
    case SyntaxKind.VariableDeclarationList:
    case SyntaxKind.StringLiteral:
      return {
        type: 'Code',
        code: [code],
      };
    case SyntaxKind.CallExpression:
      // @ts-expect-error
      switch (node.transformFlags) {
        case 0:
          if (code.indexOf('expect(') === 0) {
            return {
              type: 'Test',
              code: [code],
              lines: [getOriginalLine(node, file, sourceMap)],
            };
          }
          return {
            type: 'Code',
            code: [code],
          }
        case 512:
        case 513:
          // if the node children are: [Identifier, StringLiteral, ArrowFunction]
          // then we have either a describe or a it
          if (children.length >= 3) {
            const [first, second, third] = children;
            if (
              first.kind === SyntaxKind.Identifier &&
              second.kind === SyntaxKind.StringLiteral &&
              [SyntaxKind.ArrowFunction, SyntaxKind.FunctionExpression].includes(third.kind)
            ) {
              const name = first.getText(file);
              const description = trimChar(second.getText(file));
              const item = parseChild(third, file, sourceMap);
              const items = shortenItems([item]);

              switch (name) {
                case 'describe':
                  return {
                    type: 'TestDescription',
                    name,
                    description,
                    items,
                  } as TestDescriptionLine;
                case 'it':
                case 'test':
                  if (items) {
                    const uniqueItems = items.map(item => item.type).filter(onlyUnique);
                    if (uniqueItems.length === 1 && uniqueItems[0] === 'Test') {
                      return {
                        type: 'TestDefinition',
                        name,
                        description,
                        items: undefined,
                        tests: (items as TestLine[]).map(item => item.code).flat(),
                        lines: (items as TestLine[]).map(item => item.lines).flat(),
                      }
                    }
                  }
                  return {
                    type: 'TestDefinition',
                    name,
                    description,
                    items: items ?? [],
                    tests: undefined,
                  }
              }
            }
          }
          break;
      }
      break;
  }

  if (children.length <= 0) return null;

  // parse child nodes
  let items: Line[] = [];
  children.forEach(child => {
    const item = parseChild(child, file, sourceMap);
    if (item !== null) {
      items.push(item);
    }
  });

  if (items) {
    switch (items.length) {
      case 0:
        // if no line & no item → return nothing
        return null;
      case 1:
        // if no line & one item → return the item
        return items[0];
    }
  }

  return { type: 'Default', items: shortenItems(items) }
};
