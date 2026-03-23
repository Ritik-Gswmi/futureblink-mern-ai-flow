const mongoose = require("mongoose");

/* eslint-disable no-console */

let listenersAttached = false;

async function connectDb() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in backend environment");
  if (mongoose.connection.readyState === 1) return;

  if (!listenersAttached) {
    listenersAttached = true;
    mongoose.connection.on("connected", () => console.log("[db] connected"));
    mongoose.connection.on("disconnected", () => console.log("[db] disconnected"));
    mongoose.connection.on("error", (err) => console.error("[db] error:", err?.message || err));
  }

  console.log("[db] connecting...");
  if (uri.startsWith("mongodb+srv://")) {
    try {
      const u = new URL(uri);
      if (!u.hostname || !u.hostname.includes("mongodb.net")) {
        throw new Error(
          "Invalid MongoDB Atlas URI: hostname must be your cluster host ending in `.mongodb.net` (copy it from Atlas -> Connect)."
        );
      }
    } catch (e) {
      throw new Error(e?.message || "Invalid MongoDB Atlas URI");
    }
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20_000,
      connectTimeoutMS: 20_000,
    });
  } catch (err) {
    const msg = err?.message || String(err);
    if (msg.includes("querySrv ENOTFOUND")) {
      throw new Error(
        "MongoDB Atlas DNS lookup failed (querySrv ENOTFOUND). Check that your MONGODB_URI has the full cluster hostname (something like `cluster0.xxxxx.mongodb.net`) and that your DNS/network can resolve it."
      );
    }
    throw err;
  }
}

module.exports = { connectDb, connectToDB: connectDb };
