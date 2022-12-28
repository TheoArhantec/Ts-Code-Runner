/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
export type Nullable<T> = null | T;

export type Dictionnary<T> = { [key: string]: T };

export type Callback<T = void> = (error: Nullable<Error>, data: Nullable<T>) => void;

export type PrettyFunction = (key: string, value: string | Context) => void;

export type Opt<T> = undefined | T;

export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export type BenchOptions<T extends Function = Function, A = ArgumentTypes<T>> = {
  fn: T;
  name: T['name'] | string;
  args: A | Array<any>;
};

export type IterationOptions<T extends Function = Function> = BenchOptions<T> & {
  laps: number;
};

export type OperationSecondsOptions<T extends Function = Function> = BenchOptions<T> & {
  ms: number;
};

export type EnrichedContext<T extends BenchOptions = BenchOptions> = T & {
  result: number | string;
};

export type LogConfig = {
  verbose: boolean;
};


export type Context = {
  raw_result: Array<number>;
  fn: BenchOptions['fn'];
  name: string;
  result: Array<number>;
};

export type OperationContext = Context & {
  type: 'OPS';
  time: number;
};

export type ContextDictionnary<T extends Context> = {
  type?: T extends OperationContext ? 'OPS' : never;
} & { [key: string]: T };

export * from './formatter.types';
