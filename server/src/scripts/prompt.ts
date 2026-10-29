import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';

/** Asks questions in the terminal. askHidden does not show what you type. */
export function createPrompter() {
  // An output stream we can switch off, so a typed password is not shown on screen.
  let muted = false;
  const output = new Writable({
    write(chunk, encoding, callback) {
      if (!muted) process.stdout.write(chunk, encoding);
      callback();
    },
  });

  const rl = createInterface({ input: process.stdin, output, terminal: true });
  rl.on('SIGINT', () => {
    console.log('\nCancelled. Nothing was saved.');
    process.exit(1);
  });

  return {
    async askVisible(prompt: string): Promise<string> {
      process.stdout.write(prompt);
      return (await rl.question('')).trim();
    },
    async askHidden(prompt: string): Promise<string> {
      process.stdout.write(prompt);
      muted = true;
      const answer = await rl.question('');
      muted = false;
      process.stdout.write('\n');
      return answer;
    },
    close(): void {
      rl.close();
    },
  };
}