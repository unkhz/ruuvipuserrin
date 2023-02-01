import { parseLineFromRuuvitagListener } from './lib/listener';

const readline = require('node:readline');

const input = readline.createInterface({
  input: process.stdin,
});

input.on('line', (line: string) => {
  const measurement = parseLineFromRuuvitagListener(line)
  process.stdout.write(`${JSON.stringify(measurement)}\n`)
})