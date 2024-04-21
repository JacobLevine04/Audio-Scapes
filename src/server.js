const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3001;

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer to save files in an 'uploads' directory

//const authMiddleware = require('./authmiddleware');


app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:3000', // Adjust this to match your client's URL exactly
    credentials: true, // This is needed when using credentials mode 'include'
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


//app.use(authMiddleware);

// MongoDB URI and Client Setup
const uri = "mongodb+srv://justinphan300000:Aw9GgUyXXquZDWWI@cluster0.82gvsyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Failed to connect to MongoDB", e);
    }
}

connectDB();

app.post('/create-user', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
    }

    try {
        const db = client.db("Audio-Scapes");
        const userExists = await db.collection("users").findOne({ username });
        if (userExists) {
            return res.status(400).send("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await db.collection("users").insertOne({
            username,
            // Store hashed password
            password: hashedPassword,
            currentFriends: [],
            pendingFriends: []
        });

        res.status(201).send(`User created with ID: ${result.insertedId}`);
    } catch (e) {
        console.error("Error creating user:", e);
        res.status(500).send("Error creating user");
    }
});

app.get('/search-users', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).send("Query parameter is required");
    }

    try {
        const db = client.db("Audio-Scapes");
        const collection = db.collection("users");

        const users = await collection.find({
            username: { $regex: query, $options: "i" }
        }).toArray();

        res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).send("Error searching for users");
    }
});


app.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    const db = client.db("Audio-Scapes");
    const collection = db.collection("users");

    try {
        const user = await collection.findOne({ username });
        if (!user) {
            return res.status(401).send('User not found');
        }

        // Compare hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            // Passwords match
            res.status(200).json({ message: "Authenticated successfully" });
        } else {
            // Passwords do not match
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error("Authentication error", error);
        res.status(500).send('Internal server error');
    }
});


app.get('/friends', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send("Username query parameter is required");
    }

    try {
        const db = client.db("Audio-Scapes");
        const user = await db.collection("users").findOne({ username });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const { currentFriends, pendingFriends } = user;
        res.json({ currentFriends, pendingFriends });
    } catch (error) {
        console.error("Failed to fetch user's friends:", error);
        res.status(500).send("Error fetching friends");
    }
});


app.post('/add-friend', async (req, res) => {
    const { currentUsername, friendUsername } = req.body;
    try {
        const db = client.db("Audio-Scapes");

        await db.collection("users").updateOne({ username: friendUsername }, { $addToSet: { pendingFriends: currentUsername } });
        res.status(200).send("Friend request sent.");
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).send("Error processing friend request");
    }
});


app.post('/accept-friend', async (req, res) => {
    const { currentUsername, friendUsername } = req.body;
    try {
        const db = client.db("Audio-Scapes");

        await db.collection("users").updateOne({ username: currentUsername }, { $pull: { pendingFriends: friendUsername }, $addToSet: { currentFriends: friendUsername } });
        await db.collection("users").updateOne({ username: friendUsername }, { $addToSet: { currentFriends: currentUsername } });
        res.status(200).send("Friend request accepted.");
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).send("Error processing friend request acceptance");
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log("Uploaded file details:", req.file);

    // Extract the user ID from the form data
    const userId = req.body.userId; // Make sure 'userId' is sent as part of the form data

    if (!userId) {
        return res.status(400).send('User ID must be provided.');
    }

    const db = client.db("Audio-Scapes");
    const newFile = {
        filename: req.file.originalname,
        path: req.file.path, // The path where the file is stored
        uploader: userId, // Associate the file with the provided user ID
        createdAt: new Date(), // Timestamp for sorting
    };

    try {
        const result = await db.collection('files').insertOne(newFile);
        console.log("Result of file insertion:", result);

        if (result.acknowledged) {
            const insertedFile = {
                ...newFile,
                _id: result.insertedId
            };
            console.log("Inserted file details:", insertedFile);
            res.status(201).json(insertedFile);
        } else {
            throw new Error("File insertion not acknowledged");
        }
    } catch (e) {
        console.error("Error uploading file:", e);
        res.status(500).send("Error uploading file");
    }
});


app.get('/files', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send("Username query parameter is required");
    }

    try {
        const db = client.db("Audio-Scapes");
        const user = await db.collection("users").findOne({ username });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const { currentFriends } = user;

        // Fetch files uploaded by the current user's friends
        const files = await db.collection('files').find({ uploader: { $in: currentFriends } }).toArray();
        
        res.json(files);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).send("Error fetching files");
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
