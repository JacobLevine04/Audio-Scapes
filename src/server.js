const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3001;


// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Specify the upload directory
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`); // Generate unique filename
    }
  });
  
  // Create multer instance
  const upload = multer({ storage: storage });
  
app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


const uri = "mongodb+srv://justinphan300000:Aw9GgUyXXquZDWWI@cluster0.82gvsyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

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


// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    // Respond with the filename or any other data if needed
    res.status(201).json({ fileName: file.filename });
});


// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Retrieve uploaded files
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).send('Error reading files');
        }
        res.json(files);
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});