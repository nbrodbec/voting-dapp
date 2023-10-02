import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = `mongodb+srv://account:${process.env.MONGODB_PASSWORD}@cluster0.ck9ra97.mongodb.net/?retryWrites=true&w=majority`;

async function runWithCollection(operation) {
  let result;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    const db = client.db('production');
    const pollCollection = db.collection('polls');
    result = await operation(pollCollection);
  } catch (err) {
    console.dir(err);
  } finally {
    await client.close();
    return result;
  }
}

export async function getAddressFromCode(code) {
  return await runWithCollection(async (pollCollection) => {
    const document = await pollCollection.findOne({ code: code });
    if (document) {
      return document.address;
    } else {
      return null;
    }
  });
}

export async function getOwnedPolls(ownerAddress) {
  return await runWithCollection(async (pollCollection) => {
    const cursor = await pollCollection.find({ owner: ownerAddress });
    let addresses = [];
    for await (const doc of cursor) {
      addresses.push([doc.code, doc.address]);
    }
    return addresses;
  });
}

export async function addPoll(code, pollAddress, ownerAddress) {
  return await runWithCollection(async (pollCollection) => {
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
  });
}
