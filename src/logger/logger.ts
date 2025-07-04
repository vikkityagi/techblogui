// logger.ts
import { environment } from '../environment/environment';

export class Logger {
  private static isEnabled = !environment.production;  

  static log(...args: any[]): void {
    if (Logger.isEnabled) {
      console.log(...args);
    }
  }

  static warn(...args: any[]): void {
    if (Logger.isEnabled) {
      console.warn(...args);
    }
  }

  static error(...args: any[]): void {
    if (Logger.isEnabled) {
      console.error(...args);
    }
  }

  static info(...args: any[]): void {
    if (Logger.isEnabled) {
      console.info(...args);
    }
  }
}
