// /* eslint-disable no-console */
// import { MongoClient } from 'mongodb';
// import { faker } from '@faker-js/faker';
// import dotenv from 'dotenv';

// dotenv.config();

// const VERSION = 2;

// const setup = async () => {
//   let client;

//   try {
//     console.log('setup: Connecting mongo client');

//     client = new MongoClient(process.env.MONGODB_URI);
//     await client.connect();

//     let currentSeed = null;
//     try {
//       currentSeed = await client.db('main').collection('seeder').findOne();
//     } catch (error) {
//       // Collection does not exists - create on insert
//     }

//     if (currentSeed?.version === VERSION) {
//       console.log(`setup: 🌱 Already seeded with current seeder version: ${VERSION}`);
//       return null;
//     }
//     console.log(`setup: 🌱 Dropping previous and seeding new database with version: ${VERSION}`);

//     // SEED CLIENTS //

//     const records = [...Array(25)].map(() => {
//       const [firstName, lastName] = faker.person.fullName().split(' ');
//       const username = faker.internet.userName({ firstName, lastName });
//       const email = faker.internet.email({ firstName, lastName });
//       const image = faker.image.urlLoremFlickr({ category: 'people', height: 480, width: 640 });

//       return {
//         name: `${firstName} ${lastName}`,
//         username,
//         email,
//         image,
//         followers: 0,
//         emailVerified: null,
//       };
//     });

//     const clientsCollection = client.db('main').collection('clients');
//     await clientsCollection.drop();
//     const clientsInsert = await clientsCollection.insertMany(records);

//     if (clientsInsert.acknowledged) {
//       console.log('🌱 Successfully inserted clients');
//     }

//     // SEED VERSION //

//     const seedVersionUpdate = await client
//       .db('main')
//       .collection('seeder')
//       .updateOne(
//         { name: 'seeder' },
//         {
//           $set: {
//             name: 'seeder',
//             version: VERSION,
//             seededAt: Date.now(),
//           },
//         },
//         { upsert: true },
//       );

//     if (seedVersionUpdate.acknowledged) {
//       console.log(`setup: 🌱 Successfully seeded database with version: ${VERSION}`);
//     }
//   } catch (error) {
//     console.error(error.message);
//     return 'Database is not ready yet';
//   } finally {
//     console.log('setup: Closing mongo client');
//     await client?.close();
//   }
//   return null;
// };

// try {
//   await setup();
// } catch {
//   console.warn('setup: 🌱 Database is not ready yet. Skipping seeding...');
// }

// export { setup };
