const readline = require('node:readline');

const input = readline.createInterface({
  input: process.stdin,
});

let lineNumber = 0;
input.on('line', (line: string) => {
  lineNumber++
  const lineId = lineNumber.toString().padStart(3, '0')
  process.stdout.write(`${lineId} ${line}\n`)
})