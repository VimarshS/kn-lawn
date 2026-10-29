import { connectDatabase, disconnectDatabase } from '../config/database';
import { AdminUser } from '../models/AdminUser';
import { hashPassword, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../utils/password';
import { createPrompter } from './prompt';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const prompter = createPrompter();

async function main(): Promise<void> {
  await connectDatabase();
  await AdminUser.init(); // make sure the unique index on email exists

  if (await AdminUser.exists({ role: 'owner' })) {
    console.log('An owner account already exists. Nothing was created.');
    return;
  }

  console.log('Create the owner account for the admin portal.');
  const name = await prompter.askVisible('Name: ');
  const email = (await prompter.askVisible('Email: ')).toLowerCase();
  const password = await prompter.askHidden(
    `Password (${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters, hidden): `,
  );
  const repeated = await prompter.askHidden('Repeat password (hidden): ');

  const problems: string[] = [];
  if (!name) problems.push('Name is required.');
  if (!EMAIL_PATTERN.test(email)) problems.push('Email does not look valid.');
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    problems.push(`Password must be ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters.`);
  }
  if (password !== repeated) problems.push('The two passwords do not match.');

  if (problems.length > 0) {
    console.error('Nothing was created:');
    problems.forEach((problem) => console.error(`  - ${problem}`));
    process.exitCode = 1;
    return;
  }

  const passwordHash = await hashPassword(password);
  await AdminUser.create({ name, email, passwordHash, role: 'owner' });
  console.log(`Owner account created for ${email}.`);
}

main()
  .catch((error) => {
    if ((error as { code?: number }).code === 11000) {
      console.error('An account with that email already exists.');
    } else {
      // Print the reason only, never anything that could contain a secret
      console.error('Failed:', error instanceof Error ? error.message : error);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    prompter.close();
    await disconnectDatabase();
  });