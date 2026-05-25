import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { CmsData } from "./src/types";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "data", "cms_db.json");

// Ensure dynamic directory exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
}

// Seed Initial Data
const SEED_DATA: CmsData = {
  header: {
    heroTitle: "Deep Roots.<br><em>Open Horizons.</em>",
    heroSub: "An immersive destination in Dubai where exhibitions, storytelling, rhythm, movement, art, and shared experience come together. A space to learn, create, connect, and belong.",
    tickerItems: [
      "Exhibitions",
      "Storytelling Nights",
      "Rhythm & Movement",
      "Cultural Workshops",
      "School Visits",
      "Corporate Experiences",
      "Art & Craft",
      "Family Days",
      "Cultural Dining",
      "Private Events"
    ],
    footerDesc: "An immersive cultural destination bringing people together through exhibitions, storytelling, creativity, movement, and shared experience.",
    footerTagline: "Experience. Connect. Belong."
  },
  experiences: [
    {
      id: "exp-1",
      number: "01",
      title: "Gallery & Rotating Exhibitions",
      description: "Immersive cultural exhibitions that rotate seasonally, bringing new stories and perspectives from across the world."
    },
    {
      id: "exp-2",
      number: "02",
      title: "Storytelling Experiences",
      description: "Live storytelling sessions that bring ancient and contemporary narratives to life through voice, movement, and light."
    },
    {
      id: "exp-3",
      number: "03",
      title: "Rhythm, Music & Movement",
      description: "Drumming circles, dance workshops, and rhythmic experiences that connect body and culture in joyful participation."
    },
    {
      id: "exp-4",
      number: "04",
      title: "Art & Craft Workshops",
      description: "Hands-on creative sessions where participants make, shape, and express through cultural craft traditions."
    },
    {
      id: "exp-5",
      number: "05",
      title: "Cultural Dining & Café",
      description: "A curated café space where food becomes storytelling — flavours, aromas, and gatherings inspired by global cultures."
    },
    {
      id: "exp-6",
      number: "06",
      title: "Evening Events & Performances",
      description: "Curated evenings of music, spoken word, cultural film, and collaborative performances for all audiences."
    }
  ],
  exhibitions: [
    {
      id: "exh-1",
      badge: "I",
      title: "Roots & Routes — African Migration Stories",
      type: "Photography · Installation · Oral History",
      status: "Now",
      isNow: true
    },
    {
      id: "exh-2",
      badge: "II",
      title: "The Rhythm of Making — Craft & Identity",
      type: "Textile · Ceramics · Workshop",
      status: "Jun 2025",
      isNow: false
    },
    {
      id: "exh-3",
      badge: "III",
      title: "Crossing Worlds — Global Cultural Dialogues",
      type: "Multi-cultural · Interactive · Immersive",
      status: "Sep 2025",
      isNow: false
    }
  ],
  events: [
    {
      id: "ev-1",
      day: "24",
      month: "May",
      category: "Evening Event",
      title: "Rhythms of Us — A Night of Music & Storytelling",
      time: "7:00 PM",
      audience: "All Welcome",
      theme: "clay"
    },
    {
      id: "ev-2",
      day: "01",
      month: "Jun",
      category: "Workshop",
      title: "Weaving Words — Textile Art & Cultural Stories",
      time: "10:00 AM",
      audience: "Families",
      theme: "moss"
    },
    {
      id: "ev-3",
      day: "08",
      month: "Jun",
      category: "Cultural Talk",
      title: "Identity & Expression — A Cross-Cultural Dialogue",
      time: "6:30 PM",
      audience: "Adults",
      theme: "indigo"
    }
  ],
  bookings: [
    {
      id: "bk-1",
      name: "GEMS World Academy",
      email: "fieldtrips@gems.com",
      phone: "+971 4 400 0000",
      type: "school",
      notes: "Requesting space for 45 pupils for rhythm and exhibition zones on Jun 15th.",
      status: "unread",
      timestamp: new Date().toISOString()
    }
  ]
};

function getDb(): CmsData {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(SEED_DATA, null, 2), "utf8");
      return SEED_DATA;
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database", error);
    return SEED_DATA;
  }
}

function writeDb(data: CmsData) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database", error);
  }
}

app.use(express.json());

// API Endpoints
app.get("/api/cms/all", (req, res) => {
  res.json(getDb());
});

// Update Header Configuration
app.post("/api/cms/header", (req, res) => {
  const db = getDb();
  db.header = { ...db.header, ...req.body };
  writeDb(db);
  res.json({ success: true, header: db.header });
});

// Experiences CRUD
app.post("/api/cms/experiences", (req, res) => {
  const db = getDb();
  const newItem = {
    id: "exp-" + Date.now(),
    number: req.body.number || String(db.experiences.length + 1).padStart(2, '0'),
    title: req.body.title || "Untitled Experience",
    description: req.body.description || ""
  };
  db.experiences.push(newItem);
  writeDb(db);
  res.json({ success: true, item: newItem });
});

app.put("/api/cms/experiences/:id", (req, res) => {
  const db = getDb();
  const index = db.experiences.findIndex(x => x.id === req.params.id);
  if (index !== -1) {
    db.experiences[index] = { ...db.experiences[index], ...req.body };
    writeDb(db);
    res.json({ success: true, item: db.experiences[index] });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/api/cms/experiences/:id", (req, res) => {
  const db = getDb();
  db.experiences = db.experiences.filter(x => x.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Exhibitions CRUD
app.post("/api/cms/exhibitions", (req, res) => {
  const db = getDb();
  const newItem = {
    id: "exh-" + Date.now(),
    badge: req.body.badge || "NEW",
    title: req.body.title || "Untitled Exhibition",
    type: req.body.type || "",
    status: req.body.status || "Soon",
    isNow: req.body.isNow ?? false
  };
  db.exhibitions.push(newItem);
  writeDb(db);
  res.json({ success: true, item: newItem });
});

app.put("/api/cms/exhibitions/:id", (req, res) => {
  const db = getDb();
  const index = db.exhibitions.findIndex(x => x.id === req.params.id);
  if (index !== -1) {
    db.exhibitions[index] = { ...db.exhibitions[index], ...req.body };
    writeDb(db);
    res.json({ success: true, item: db.exhibitions[index] });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/api/cms/exhibitions/:id", (req, res) => {
  const db = getDb();
  db.exhibitions = db.exhibitions.filter(x => x.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Events CRUD
app.post("/api/cms/events", (req, res) => {
  const db = getDb();
  const newItem = {
    id: "ev-" + Date.now(),
    day: req.body.day || "01",
    month: req.body.month || "Jan",
    category: req.body.category || "General Event",
    title: req.body.title || "Untitled Event",
    time: req.body.time || "12:00 PM",
    audience: req.body.audience || "All Welcome",
    theme: req.body.theme || "clay"
  };
  db.events.push(newItem);
  writeDb(db);
  res.json({ success: true, item: newItem });
});

app.put("/api/cms/events/:id", (req, res) => {
  const db = getDb();
  const index = db.events.findIndex(x => x.id === req.params.id);
  if (index !== -1) {
    db.events[index] = { ...db.events[index], ...req.body };
    writeDb(db);
    res.json({ success: true, item: db.events[index] });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/api/cms/events/:id", (req, res) => {
  const db = getDb();
  db.events = db.events.filter(x => x.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Bookings / Contact submissions
app.post("/api/bookings", (req, res) => {
  const db = getDb();
  const newBooking = {
    id: "bk-" + Date.now(),
    name: req.body.name || "Anonymous Guest",
    email: req.body.email || "",
    phone: req.body.phone || "",
    type: req.body.type || "general",
    notes: req.body.notes || "",
    status: "unread" as const,
    timestamp: new Date().toISOString()
  };
  db.bookings.push(newBooking);
  writeDb(db);
  res.json({ success: true, booking: newBooking });
});

app.put("/api/cms/bookings/:id", (req, res) => {
  const db = getDb();
  const index = db.bookings.findIndex(x => x.id === req.params.id);
  if (index !== -1) {
    db.bookings[index] = { ...db.bookings[index], ...req.body };
    writeDb(db);
    res.json({ success: true, booking: db.bookings[index] });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/api/cms/bookings/:id", (req, res) => {
  const db = getDb();
  db.bookings = db.bookings.filter(x => x.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Admin Auth
app.post("/api/cms/login", (req, res) => {
  const { username, password } = req.body;
  // Fallback credentials
  if (username === "admin" && password === "admin") {
    res.json({ success: true, token: "afro-baobab-auth-session" });
  } else {
    res.status(401).json({ success: false, error: "Incorrect username or password" });
  }
});

async function startServer() {
  // Vite Integration for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
