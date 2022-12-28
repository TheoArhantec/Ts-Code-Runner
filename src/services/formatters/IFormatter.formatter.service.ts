/* eslint-disable no-unused-vars */
import { Callback, Context, ContextDictionnary, IFormatterOptions, Nullable } from '@src/types';

export interface IFormatter {
  format: <T extends Context = Context>(result: ContextDictionnary<T>, options: IFormatterOptions, done: Callback) => void;
  readonly validateOptions: (options: IFormatterOptions) => Nullable<Error>;
}
