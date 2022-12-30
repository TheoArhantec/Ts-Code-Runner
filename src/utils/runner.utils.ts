import { SECONDS_IN_MS } from '@src/constants';
import { Context } from '@src/types';

export class RunnerUtils {
  /**
   * Vérifie si l'objet est un contexte de benchmark valide.
   * @param {unknown} context - L'objet à vérifier.
   * @returns {context is Context} `true` si l'objet est un contexte de benchmark valide, `false` sinon.
   */
  public static isContextObject(context: unknown): context is Context {
    return typeof context === 'object' && context !== null && 'result' in context;
  }
  /**
   * Mélange aléatoirement les éléments d'un tableau.
   * @template T
   * @param {T[]} array - Le tableau à mélanger.
   * @returns {T[]} Le tableau mélangé.
   */
  public static shuffleArray<T = unknown>(array: Array<T>): Array<T> {
    const arrayCopy: Array<T> = [...array];

    for (let i: number = 0; i < arrayCopy.length - 1; i++) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }

    return arrayCopy;
  }
  /**
   * Calcule la moyenne d'un tableau de nombres.
   * @param {number[]} numbers - Le tableau de nombres.
   * @returns {number} La moyenne des nombres.
   */
  public static mean(numbers: Array<number>): number {
    if (numbers.length === 0) return 0;
    let sum: number = 0;
    for (let i: number = 0; i < numbers.length; i++) {
      sum += numbers[i];
    }
    return sum / numbers.length;
  }

  public static getNbActionsSeconds(nbActions: number, timeInMs: number): number {
    return nbActions / (timeInMs / SECONDS_IN_MS);
  }
}
