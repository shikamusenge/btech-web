// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import http from "http";
import db from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // for form POST
app.use(express.json());

// POST /join - receives regno + name, saves user and redirects to chat with query params
app.post("/join", (req, res) => {
  const { regno, name } = req.body;
  if (!regno || !name) {
    return res.status(400).send("Missing regno or name");
  }

  const stmt = db.prepare("INSERT OR IGNORE INTO users(regno, name) VALUES (?, ?)");
  stmt.run(regno.trim(), name.trim(), function (err) {
    stmt.finalize();
    // redirect to chat page and pass name & regno as query params
    return res.redirect(`/chat.html?name=${encodeURIComponent(name.trim())}&regno=${encodeURIComponent(regno.trim())}`);
  });
});

// API: get last 50 messages (for initial load)
app.get("/api/messages", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY id DESC LIMIT 50", (err, rows) => {
    if (err) return res.status(500).json([]);
    // return in chronological order
    res.json(rows.reverse());
  });
});

// Broadcast helper
function broadcast(text) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(text);
    }
  });
}

// WebSocket message handling
wss.on("connection", (ws, req) => {
  ws.on("message", (raw) => {
    const text = raw.toString();

    // Expect format "username: message"
    const idx = text.indexOf(":");
    let username = "Unknown";
    let message = text;
    if (idx !== -1) {
      username = text.substring(0, idx).trim();
      message = text.substring(idx + 1).trim();
    }

    // Save to DB
    db.run("INSERT INTO messages(username, message) VALUES (?, ?)", [username, message], (err) => {
      if (err) console.error("DB save message error:", err);
    });

    // Broadcast to all clients
    broadcast(`${username}: ${message}`);
  });

  ws.on("close", () => {
    // optional: handle disconnect
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
