import { FailDetail } from './matchers';

export interface RunError {
  path: string;
  logicalPath: string[];
  details: FailDetail[]
}

export interface RunDetails {
  success: boolean;
  errors: RunError[]
}

export interface RunResult {
  output: string[];
  details: RunDetails;
}
