import { Callback, Context, ContextDictionnary, IFormatterOptions, MardownFormatterOptions, Nullable } from '@src/types';
import { IFormatter } from './IFormatter.formatter.service';
import fs from 'fs';
import { RunnerUtils } from '@src/utils/runner.utils';
import { PrinterUtils } from '@src/utils/printer.utils';

export class MardownFormatter implements IFormatter {

  /**
   * Formate les résultats de benchmark dans un fichier Markdown.
   * @template T - Le type de contexte des résultats de benchmark.
   * @param {ContextDictionnary<T>} result - Les résultats de benchmark à formater.
   * @param {MardownFormatterOptions} options - Les options de formatage du fichier Markdown.
   * @param {Callback} done - La fonction à appeler une fois le fichier écrit.
   */
  public format<T extends Context = Context>(result: ContextDictionnary<T>, options: MardownFormatterOptions, done: Callback): void {
    const maybeError: Nullable<Error> = this.validateOptions(options);
    if (maybeError instanceof Error) return done(maybeError, null);
    let fileContent: string = `# ${options.filename}\n\n`;
    const values: Array<unknown> = Object.values(result);
    for (let index: number = 0; index < values.length; index++) {
      const value: unknown = values[index];
      if (!RunnerUtils.isContextObject(value)) continue;
      fileContent = this.buildSection(fileContent, value, index);
    }
    fs.writeFile(`${options.path}/${options.filename}.md`, fileContent, done);
  }

  /**
   * Construit une section de résultats de benchmark dans le fichier Markdown.
   * @param {string} file - Le contenu du fichier Markdown à modifier.
   * @param {Context} context - Le contexte de benchmark à inclure dans la section.
   * @param {number} index - L'index de la section dans le fichier Markdown.
   * @returns {string} Le contenu du fichier Markdown modifié.
   */
  private buildSection(file: string, context: Context, index: number): string {
    if (index > 1) file = this.addSeparator(file);
    file = this.buildTitle(file, context);
    file = this.printFunction(file, context);
    file = this.printResult(file, context);
    return file;
  }

  /**
   * Ajoute un titre de section de résultats de benchmark au fichier Markdown.
   * @param {string} file - Le contenu du fichier Markdown à modifier.
   * @param {Context} context - Le contexte de benchmark à inclure dans le titre.
   * @returns {string} Le contenu du fichier Markdown modifié.
   */
  private buildTitle(file: string, context: Context): string {
    return file + `### [BENCHMARK] - ${context.name}\n`;
  }

  /**
   * Ajoute un séparateur au fichier Markdown.
   * @param {string} file - Le contenu du fichier Markdown à modifier.
   * @returns {string} Le contenu du fichier Markdown modifié.
   */
  private addSeparator(file: string): string {
    return file + '\n---\n';
  }

  /**
   * Ajoute les informations sur la fonction de benchmark au fichier Markdown.
   * @param {string} file - Le contenu du fichier Markdown à modifier.
   * @param {Context} context - Le contexte de benchmark à inclure dans le fichier.
   * @returns {string} Le contenu du fichier Markdown modifié.
   */
  private printFunction(file: string, context: Context): string {
    return file + `\n\n\`\`\`\n${context.fn.toString()}\n\`\`\`\n\n`;
  }

  /**
   * Ajoute les résultats de benchmark au fichier Markdown.
   * @param {string} file - Le contenu du fichier Markdown à modifier.
   * @param {Context} context - Le contexte de benchmark à inclure dans le fichier.
   * @returns {string} Le contenu du fichier Markdown modifié.
   */
  private printResult(file: string, context: Context): string {
    const meanNumber: string = RunnerUtils.mean(context.result).toFixed(3);
    file += `\n\n résultat: ${PrinterUtils.prettyNumber(meanNumber)} Ops/s\n `;
    return file;
  }

  /**
   * Valide les options de formatage du fichier Markdown.
   * @param {IFormatterOptions} options - Les options à valider.
   * @returns {Nullable<Error>} Une erreur si les options sont invalides, `null` sinon.
   */
  public validateOptions(options: IFormatterOptions): Nullable<Error> {
    if (!options.filename) throw new Error('Missing filename option.');
    if (!options.path) throw new Error('Missing path option.');
    return null;
  }
}
