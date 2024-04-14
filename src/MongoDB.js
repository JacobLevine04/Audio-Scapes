const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://justinphan300000:Aw9GgUyXXquZDWWI@cluster0.82gvsyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function addFriendsFields() {
    try {
        await client.connect();
        const database = client.db("Audio-Scapes");
        const users = database.collection("users");

        const updateResult = await users.updateMany(
            {
                $or: [
                    { currentFriends: { $exists: false } },
                    { pendingFriends: { $exists: false } }
                ]
            },
            {
                $set: {
                    currentFriends: [],
                    pendingFriends: []
                }
            }
        );

        console.log(`Documents updated: ${updateResult.modifiedCount}`);
    } finally {
        await client.close();
    }
}

addFriendsFields().catch(console.dir);
