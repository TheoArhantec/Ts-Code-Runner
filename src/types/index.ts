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
  args?: Opt<A | Array<any>>;
};

export type Context = {
  type: 'OPS';
  raw_result: Array<number>;
  fn: BenchOptions['fn'];
  name: string;
  result: Array<number>;
  time: number;
} & { [key:string]: any };

export type ContextDictionnary<T extends Context = Context> = { [key: string]: T };

export type BenchmarkConfig = {
  lap: number;
  timeIsMs: number;
};

export type FunctionVoid = (...args: any) => void;

export * from './formatter.types';
