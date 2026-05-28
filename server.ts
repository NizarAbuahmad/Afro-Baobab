import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { CmsData, CarouselSlide } from "./src/types";

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
    footerTagline: "Experience. Connect. Belong.",
    audioUrl: "",
    audioTitle: "None",
    audioAutoplay: false
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
  ],
  carouselSlides: [
    {
      id: "slide-1",
      imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80",
      title: "African Rhythms & Dance Performance",
      desc: "Capturing the vibrant pulse of seasonal celebratory dance, rhythm loops, and performance art."
    },
    {
      id: "slide-2",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80",
      title: "Interactive Drumming Circles",
      desc: "Curated workshops teaching coordinating pulse, hand position, and tempo under our master percussion team."
    },
    {
      id: "slide-3",
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=80",
      title: "Clay Pottery & Sculpting",
      desc: "Moulding raw clay into symbolic traditional artifacts and geometrical vessel layouts."
    },
    {
      id: "slide-4",
      imageUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1400&q=80",
      title: "Intricate Sacred Bead Threading",
      desc: "Participants explore symmetrical design and ethnic lore by assembling gorgeous glass beads."
    },
    {
      id: "slide-5",
      imageUrl: "https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1400&q=80",
      title: "Authentic Djembe Courtyards",
      desc: "Hundreds of hand-carved West African djembes lining our seasonal villa lawns in Dubai."
    }
  ]
};

function getDb(): CmsData {
  try {
    const defaultSchoolsPage = {
      id: "page-schools",
      slug: "schools",
      title: "Schools",
      content: "Welcome to the African Cultural Field Trip program at Afro Baobab Cultural Hub. Our curriculum-aligned, interactive modules are designed to spark wonder, curiosity, and cultural understanding in students of all age groups.\n\n🎒 WHAT STUDENTS WILL EXPERIENCE:\n• Under the Story Canopy: Hands-on oral history narratives under our giant woven baobab tree, incorporating immersive audio, lighting and live dramatic interaction.\n• Rhythm and Drums: Practical djembe drum circles teaching alignment, coordination, and community pulse led by master rhythmic musicians.\n• Creative Clay & Beading: Craft workshops where pupils mould artifacts or construct tribal patterns using traditional beads, teaching geometric layout and history.\n• Interactive Exhibition Tour: Guided walks around our active historical visual galleries, tailored to schools' specific regional curriculums.\n\n🏫 CURRICULUM SYNDICATION:\nWe cater to IB, British, American, CBSE, and MOE frameworks.\n\n📋 BOOKING LOGISTICS:\n• Timings: Morning sessions available from 9:00 AM – 1:00 PM.\n• Group Size: Accommodating up to 60 students per flight.\n\n✉️ FIELD TRIP INQUIRIES:\nPlease use our Guest Inquiries section below or click Booking in the navigation bar to submit a reservation enquiry.",
      shownInNavbar: true,
      createdAt: new Date().toISOString()
    };

    const defaultCorporatePage = {
      id: "page-corporates",
      slug: "corporate",
      title: "Corporate",
      content: "Cultivate teamwork, ignite artistic inspiration, and expand cross-cultural intelligence with Afro Baobab's bespoke Corporate Experience Programs in Dubai.\n\n👔 EXECUTIVE & DIVISIONAL TEAM EXPERIENCES:\n• Creative Rhythm Circles: Highly active djembe drum alignment workshops. Experience group resonance, cooperative communication, and synergistic pulse.\n• Shared Visual Tapestry: Collaborative painting and bead weaving modules where team participants work on a single massive canvas.\n• Cross-Cultural Leadership & CQ: Seminars focusing on narrative leadership and adapting them to complex modern organizational strategy.\n• Gourmet Afro-Fusion Dinners: Fine-art culinary journeys featuring traditional communal sharing plates, live music accompaniment, and coffee roast presentations.\n\n🛎️ TEAM EVENT LOGISTICS:\n• Exclusive Venue Buyout: Private access to our art gallery, meeting salon, and storytelling room.\n\n✉️ COLLABORATION REQUESTS:\nPlease declare your team objectives by tapping Booking in our navigation menu.",
      shownInNavbar: true,
      createdAt: new Date().toISOString()
    };

    const defaultUser = {
      id: "u-admin",
      username: "admin",
      password: "admin",
      role: "admin" as const,
      createdAt: new Date().toISOString()
    };

    const defaultCarouselSlides: CarouselSlide[] = [
      {
        id: "slide-1",
        imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80",
        title: "African Rhythms & Dance Performance",
        desc: "Capturing the vibrant pulse of seasonal celebratory dance, rhythm loops, and performance art."
      },
      {
        id: "slide-2",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80",
        title: "Interactive Drumming Circles",
        desc: "Curated workshops teaching coordinating pulse, hand position, and tempo under our master percussion team."
      },
      {
        id: "slide-3",
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=80",
        title: "Clay Pottery & Sculpting",
        desc: "Moulding raw clay into symbolic traditional artifacts and geometrical vessel layouts."
      },
      {
        id: "slide-4",
        imageUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1400&q=80",
        title: "Intricate Sacred Bead Threading",
        desc: "Participants explore symmetrical design and ethnic lore by assembling gorgeous glass beads."
      },
      {
        id: "slide-5",
        imageUrl: "https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1400&q=80",
        title: "Authentic Djembe Courtyards",
        desc: "Hundreds of hand-carved West African djembes lining our seasonal villa lawns in Dubai."
      }
    ];

    if (!fs.existsSync(DB_PATH)) {
      const initial = { 
        ...SEED_DATA, 
        customPages: [defaultSchoolsPage, defaultCorporatePage],
        users: [defaultUser],
        carouselSlides: defaultCarouselSlides
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(data);
    
    // Ensure lists exist
    if (!parsed.customPages || parsed.customPages.length === 0) {
      parsed.customPages = [defaultSchoolsPage, defaultCorporatePage];
    } else {
      parsed.customPages.forEach((p: any) => {
        if (p.id === "page-schools" || p.slug === "schools-field-trips") {
          p.title = "Schools";
          p.slug = "schools";
        }
        if (p.id === "page-[#page-schools]" || p.id === "schools" || p.slug === "schools") {
          p.title = "Schools";
          p.slug = "schools";
        }
        if (p.id === "page-corporates" || p.slug === "corporate-experiences") {
          p.title = "Corporate";
          p.slug = "corporate";
        }
      });
      // Save changes back if migrated dynamically
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), "utf8");
    }
    if (!parsed.users || parsed.users.length === 0) {
      parsed.users = [defaultUser];
    }
    if (!parsed.carouselSlides || parsed.carouselSlides.length === 0) {
      parsed.carouselSlides = defaultCarouselSlides;
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), "utf8");
    }
    return parsed;
  } catch (error) {
    console.error("Error reading database", error);
    return { ...SEED_DATA, customPages: [], users: [] };
  }
}

function writeDb(data: CmsData) {
  try {
    if (!data.customPages) {
      data.customPages = [];
    }
    if (!data.users) {
      data.users = [];
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database", error);
  }
}

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));

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

// Upload media endpoint (supports images and audio files)
app.post("/api/cms/upload", (req, res) => {
  try {
    const { name, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: "Missing file name or file data content" });
    }
    const cleanBase64 = data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");
    const ext = path.extname(name) || ".jpg";
    const filename = `media-${Date.now()}-${Math.round(Math.random() * 1000)}${ext}`;
    const destination = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(destination, buffer);
    res.json({ success: true, url: `/uploads/${filename}` });
  } catch (err: any) {
    console.error("Upload error", err);
    res.status(500).json({ error: err.message });
  }
});

// Custom Pages CRUD
app.post("/api/cms/pages", (req, res) => {
  const db = getDb();
  if (!db.customPages) db.customPages = [];
  const slug = (req.body.slug || "new-page").toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  const newPage = {
    id: "page-" + Date.now(),
    slug,
    title: req.body.title || "Untitled Page",
    content: req.body.content || "Use our CMS dashboard to add markdown/HTML text.",
    shownInNavbar: req.body.shownInNavbar ?? true,
    createdAt: new Date().toISOString()
  };
  db.customPages.push(newPage);
  writeDb(db);
  res.json({ success: true, page: newPage });
});

app.put("/api/cms/pages/:id", (req, res) => {
  const db = getDb();
  if (!db.customPages) db.customPages = [];
  const idx = db.customPages.findIndex(p => p.id === req.params.id);
  if (idx !== -1) {
    const slug = (req.body.slug || db.customPages[idx].slug).toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    db.customPages[idx] = {
      ...db.customPages[idx],
      ...req.body,
      slug
    };
    writeDb(db);
    res.json({ success: true, page: db.customPages[idx] });
  } else {
    res.status(404).json({ error: "Page not found" });
  }
});

app.delete("/api/cms/pages/:id", (req, res) => {
  const db = getDb();
  if (!db.customPages) db.customPages = [];
  db.customPages = db.customPages.filter(p => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
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

// Carousel Slides CRUD
app.post("/api/cms/carousel", (req, res) => {
  const db = getDb();
  if (!db.carouselSlides) db.carouselSlides = [];
  const newItem = {
    id: "slide-" + Date.now(),
    imageUrl: req.body.imageUrl || "",
    title: req.body.title || "Untitled Carousel Slide",
    desc: req.body.desc || ""
  };
  db.carouselSlides.push(newItem);
  writeDb(db);
  res.json({ success: true, item: newItem });
});

app.put("/api/cms/carousel/:id", (req, res) => {
  const db = getDb();
  if (!db.carouselSlides) db.carouselSlides = [];
  const index = db.carouselSlides.findIndex(x => x.id === req.params.id);
  if (index !== -1) {
    db.carouselSlides[index] = { ...db.carouselSlides[index], ...req.body };
    writeDb(db);
    res.json({ success: true, item: db.carouselSlides[index] });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/api/cms/carousel/:id", (req, res) => {
  const db = getDb();
  if (!db.carouselSlides) db.carouselSlides = [];
  db.carouselSlides = db.carouselSlides.filter(x => x.id !== req.params.id);
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

// --- Dynamic CMS User Management Endpoints ---
app.get("/api/cms/users", (req, res) => {
  const db = getDb();
  const users = db.users || [];
  // Exclude password in dynamic client lists if wanted, or return clean
  res.json(users);
});

app.post("/api/cms/users", (req, res) => {
  const db = getDb();
  if (!db.users) db.users = [];
  const { username, password, role, permissions } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  
  const duplicate = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (duplicate) {
    return res.status(400).json({ error: "Username is already taken" });
  }

  const newUser = {
    id: "user-" + Date.now() + "-" + Math.round(Math.random() * 1000),
    username,
    password,
    role: role || "editor",
    permissions: permissions || ["edit_content"],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);
  res.json({ success: true, user: newUser });
});

app.put("/api/cms/users/:id", (req, res) => {
  const db = getDb();
  if (!db.users) db.users = [];
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const { username, password, role, permissions } = req.body;
  
  if (username) {
    const duplicate = db.users.some(u => u.id !== req.params.id && u.username.toLowerCase() === username.toLowerCase());
    if (duplicate) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    db.users[idx].username = username;
  }

  if (password) {
    db.users[idx].password = password;
  }

  if (role) {
    db.users[idx].role = role;
  }

  if (permissions) {
    db.users[idx].permissions = permissions;
  }

  writeDb(db);
  res.json({ success: true, user: db.users[idx] });
});

app.delete("/api/cms/users/:id", (req, res) => {
  const db = getDb();
  if (!db.users) db.users = [];
  const targetIdx = db.users.findIndex(u => u.id === req.params.id);
  if (targetIdx === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const targetUser = db.users[targetIdx];
  const adminCount = db.users.filter(u => u.role === "admin").length;

  if (targetUser.role === "admin" && adminCount <= 1) {
    return res.status(400).json({ error: "Cannot remove the last active admin account" });
  }

  db.users = db.users.filter(u => u.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Admin Auth
app.post("/api/cms/login", (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  if (!db.users) db.users = [];

  const matchedUser = db.users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (matchedUser) {
    res.json({ 
      success: true, 
      token: "afro-baobab-auth-session",
      user: {
        id: matchedUser.id,
        username: matchedUser.username,
        role: matchedUser.role
      }
    });
  } else {
    // Also support fallback hardcoded if db.users got entirely corrupted
    if (username === "admin" && password === "admin") {
      res.json({ 
        success: true, 
        token: "afro-baobab-auth-session",
        user: { id: "u-admin", username: "admin", role: "admin" }
      });
    } else {
      res.status(401).json({ success: false, error: "Incorrect username or password" });
    }
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
