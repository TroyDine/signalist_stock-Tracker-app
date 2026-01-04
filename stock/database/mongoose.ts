import mongoose from 'mongoose';

// Add debug logging
console.log('=== ENV DEBUG ===');
console.log('MONGODB_URI from env:', process.env.MONGODB_URI);
console.log('MONGODB_URI exists?', !!process.env.MONGODB_URI);
console.log('=================');

// Temporary fallback - remove this later once env works
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dineshkannan06122025_db_user:TwRBIvIZcNdPbuoc@cluster0.ztpoifo.mongodb.net/?appName=Cluster0';

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    console.log(`Connected to database ${process.env.NODE_ENV}`);

    return cached.conn;
}