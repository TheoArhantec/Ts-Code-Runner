export class PrinterUtils {
  /**
   * Formate un nombre en ajoutant des virgules tous les 3 chiffres.
   * @param {string|number} x - Le nombre à formater.
   * @returns {string} Le nombre formaté avec des virgules tous les 3 chiffres.
   */
  public static prettyNumber(x: string | number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
