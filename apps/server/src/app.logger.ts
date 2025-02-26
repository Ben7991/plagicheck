import { ConsoleLogger, Injectable } from '@nestjs/common';
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class AppLogger extends ConsoleLogger {
  private logFilePath: string;

  constructor(context: string) {
    super(context);
    this.logFilePath = join(process.cwd(), 'logs', 'error.log');
  }

  override error(
    message: string,
    stack?: string,
    ...optionalParams: string[]
  ): void {
    appendFileSync(
      this.logFilePath,
      `[${this.getTimestamp()}, ${this.context}] => [MESSAGE] ${message}, [STACK] ${stack} [PARAMS]: ${optionalParams.join(',')}`,
    );
  }
}
