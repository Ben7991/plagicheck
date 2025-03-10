import { ConsoleLogger, Injectable } from '@nestjs/common';
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class AppLogger extends ConsoleLogger {
  private logFilePath: string;

  constructor() {
    super();
    this.logFilePath = join(process.cwd(), 'logs', 'error.log');
  }

  override error(
    message: string,
    url: string,
    ...optionalParams: string[]
  ): void {
    appendFileSync(
      this.logFilePath,
      `[${this.getTimestamp()}, ${url}] => [MESSAGE] ${message}, ${optionalParams.join(',')}`,
    );
  }
}
