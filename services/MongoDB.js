import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = `mongodb+srv://account:${process.env.MONGODB_PASSWORD}@cluster0.ck9ra97.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
let pollCollection;

async function run() {
  try {
    await client.connect();
    db = client.db('sample_mflix');
    pollCollection = db.collection('polls');
  } finally {
    // await client.close();
  }
}

export async function getAddressFromCode(code) {
  if (!db) await run().catch(console.dir);
  const document = await pollCollection.findOne({ code: code });
  if (document) {
    return document.address;
  } else {
    return null;
  }
}

export async function getOwnedPolls(ownerAddress) {
  if (!db) await run().catch(console.dir);
  const cursor = await pollCollection.find({ owner: ownerAddress });
  let addresses = [];
  for await (const doc of cursor) {
    addresses.push([doc.code, doc.address]);
  }
  return addresses;
}

export async function addPoll(code, pollAddress, ownerAddress) {
  if (!db) await run().catch(console.dir);
  if (await getAddressFromCode(code)) {
    console.log('A poll with this code already exists');
    return null;
  }

  const result = await pollCollection.insertOne({
    owner: ownerAddress,
    address: pollAddress,
    code: code,
  });

  return result.acknowledged;
}
