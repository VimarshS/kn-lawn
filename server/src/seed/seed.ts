import { env } from '../config/env';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { SiteSettings } from '../models/SiteSettings';
import { demoSettings } from './demoSettings';
import { LawnEvent } from '../models/LawnEvent';
import { demoEvents } from './demoEvents';

async function seed(): Promise<void> {
  // Safety switch: demo data must never reach the real website's database.
  if (env.NODE_ENV === 'production') {
    console.error('Refusing to seed demo data because NODE_ENV is "production".');
    process.exit(1);
  }

  await connectDatabase();
  await SiteSettings.init(); // wait until the unique index on "key" exists

  const existing = await SiteSettings.findOne({ key: 'main' });
  if (existing) {
    console.log('Settings already exist. Leaving them unchanged.');
  } else {
    await SiteSettings.create(demoSettings);
    console.log('Demo settings created.');
  }
  
  await LawnEvent.init(); // make sure the unique index on "slug" exists
  if ((await LawnEvent.countDocuments()) > 0) {
    console.log('Events already exist. Leaving them unchanged.');
  } else {
    await LawnEvent.insertMany(demoEvents);
    console.log(`Demo events created: ${demoEvents.length}.`);
  }

  const count = await SiteSettings.countDocuments();
  const indexes = await SiteSettings.collection.indexes();
  console.log(`Settings documents in database: ${count}`);
  console.log(`Indexes: ${indexes.map((index) => index.name).join(', ')}`);
  console.log(`Events in database: ${await LawnEvent.countDocuments()}`);
}

seed()
  .catch((error) => {
    // Print the reason only, never the connection address
    console.error('Seeding failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => disconnectDatabase());