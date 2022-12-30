import { Context, ContextDictionnary, IFormatterOptions, Callback, Nullable } from '@src/types';
import { IFormatter } from './IFormatter.formatter.service';
import fs from 'fs';
import { RunnerUtils } from '@src/utils/runner.utils';
import { PrinterUtils } from '@src/utils/printer.utils';
import { ERROR_MISSING_FILENAME_OPTIONS, ERROR_MISSING_PATH_OPTIONS } from '@src/constants';

export class JSONFormatter implements IFormatter {
  public format<T extends Context = Context>(result: ContextDictionnary<T>, options: IFormatterOptions, done: Callback): void {
    const maybeError: Nullable<Error> = this.validateOptions(options);
    if (maybeError instanceof Error) return done(maybeError, null);

    const values: Array<unknown> = Object.values(result);
    for (let index: number = 0; index < values.length; index++) {
      const value: unknown = values[index];
      if (!RunnerUtils.isContextObject(value)) continue;
      const meanNumber: string = RunnerUtils.mean(value.result).toFixed(3);
      const prettyMean: string = PrinterUtils.prettyNumber(meanNumber);
      value['ops'] = prettyMean;
    }

    fs.writeFile(`${options.path}/${options.filename}.json`, JSON.stringify(result), done);
  }

  /**
   * Valide les options de formatage du fichier Json.
   * @param {IFormatterOptions} options - Les options à valider.
   * @returns {Nullable<Error>} Une erreur si les options sont invalides, `null` sinon.
   */
  public validateOptions(options: IFormatterOptions): Nullable<Error> {
    if (!options.filename) ERROR_MISSING_FILENAME_OPTIONS;
    if (!options.path) ERROR_MISSING_PATH_OPTIONS;
    return null;
  }
}
