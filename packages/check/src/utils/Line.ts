export interface DefaultLine {
  type: 'Default';
  items?: Line[];
}

export interface CodeLine {
  type: 'Code';
  code: string[];
  lines: (number | null)[];
}
export interface TestLine {
  type: 'Test';
  code: string[];
  lines: (number | null)[];
}

export interface TestDescriptionLine {
  type: 'TestDescription';
  name: 'describe';
  description: string;
  items: Line[];
}
type TestDefinitionLine = {
  type: 'TestDefinition';
  name: 'it' | 'test';
  description: string;
} & ({
  items: undefined;
  tests: string[];
  lines: (number | null)[];
} | {
  items: Line[];
  tests: undefined;
});

export type Line =
  DefaultLine |
  CodeLine |
  TestLine |
  TestDescriptionLine |
  TestDefinitionLine;
