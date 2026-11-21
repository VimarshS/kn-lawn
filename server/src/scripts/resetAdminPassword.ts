import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { AdminUser } from '../models/AdminUser';
import { destroyAllSessionsForUser } from '../services/sessionService';
import {
  checkPasswordStrength,
  hashPassword,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../utils/password';
import { createPrompter } from './prompt';

const prompter = createPrompter();

async function main(): Promise<void> {
  await connectDatabase();
  // Show which database we are in, so the wrong one is never changed by accident.
  console.log(`Database: ${mongoose.connection.name}`);

  const email = (await prompter.askVisible('Email of the account: ')).toLowerCase();
  const user = await AdminUser.findOne({ email });
  if (!user) {
    console.error('No account with that email. Nothing was changed.');
    process.exitCode = 1;
    return;
  }

  const password = await prompter.askHidden(
    `New password (${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters, hidden): `,
  );
  const repeated = await prompter.askHidden('Repeat new password (hidden): ');

  const problems: string[] = [];
  const strengthProblem = checkPasswordStrength(password);
  if (strengthProblem) problems.push(strengthProblem);
  if (password !== repeated) problems.push('The two passwords do not match.');

  if (problems.length > 0) {
    console.error('Nothing was changed:');
    problems.forEach((problem) => console.error(`  - ${problem}`));
    process.exitCode = 1;
    return;
  }

  await AdminUser.updateOne({ _id: user._id }, { passwordHash: await hashPassword(password) });
  await destroyAllSessionsForUser(user._id); // sign out every browser that was logged in
  console.log(`Password changed for ${user.email}. All its sessions were signed out.`);
}

main()
  .catch((error) => {
    // Print the reason only, never anything that could contain a secret
    console.error('Failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    prompter.close();
    await disconnectDatabase();
  });