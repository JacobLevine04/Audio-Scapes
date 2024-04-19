//const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

//const secret = 'jwtkey'; // This should be the same key used when signing the JWT
const uri = "mongodb+srv://justinphan300000:Aw9GgUyXXquZDWWI@cluster0.82gvsyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Saving files to 'uploads/' directory


// Connect to MongoDB - ideally, you would handle the connection elsewhere and pass the db to the middleware
async function connectDB() {
    if (!client.isConnected()) {
        await client.connect();
    }
    return client.db("Audio-Scapes");
}

const authmiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assumes a 'Bearer Token' format

    if (!token) {
        return res.status(403).json({ message: "No token provided, authorization denied" });
    }

    try {
        // Verify token
        //const decoded = jwt.verify(token, secret);
        const db = await connectDB();
        const user = await db.collection("users").findOne({ _id: ObjectId(decoded.id) });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error', error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authmiddleware;
