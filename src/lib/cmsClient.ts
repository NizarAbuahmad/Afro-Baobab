import { CmsData, Experience, Exhibition, EventItem, Booking, CmsHeader, CustomPage } from "../types";

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

    // Default Brand Logo settings
    logoTextPrimary: "AFRO",
    logoTextSecondary: "BAOBAB",
    logoSub: "CULTURAL HUB & ART GALLERY",
    logoMode: "default-emblem",
    logoImageUrl: "",
    logoEmblemColor: "#CB6A4A",

    // Default Hero background configurations
    heroWallpaperMode: "sunrise-tribal",
    heroWallpaperUrl: "",
    heroGradientStart: "#160e07",
    heroGradientEnd: "#141d30",

    // Default About Section strings
    showAbout: true,
    aboutLabel: "Our Story",
    aboutHeading: "A Place Where Culture <br />Is Not Only Seen, <br />But <span class=\"text-clay italic\">Experienced</span>",
    aboutDesc1: "Afro Baobab Cultural Hub is more than a venue. It is an immersive cultural learning destination where exhibitions, storytelling, rhythm, movement, creativity, and food become portals into human connection and discovery.",
    aboutDesc2: "Rooted in African heritage and open to the world, the hub is designed for curious minds — children, families, professionals, artists, and communities who believe culture has the power to transform.",
    aboutBtnText: "Explore Experience Zones",
    aboutFeaturedBadge: "Featured Immersive Zone",
    aboutFeaturedTitle: "The Living Baobab <span class=\"text-clay italic\">Story Room</span>",
    aboutFeaturedDesc: "Sit under the giant woven Baobab canopy where surround-sound rhythm, projection-mapping story sheets, and live actors combine to share heritage tales.",
    aboutFeaturedImageMode: "pattern",
    aboutFeaturedImageUrl: "",
    aboutStatsNumber: "6+",
    aboutStatsLabel: "Immersive\nExperience Zones",

    // Default Heritage (Living Visual Language) Customization
    showHeritage: true,
    heritageLabel: "Living Visual Language",
    heritageTitle: "Heritage <span class=\"text-clay italic\">Symbols & Artistry</span>",
    heritageSubTitle: "Explore the traditional visual motifs of African storytelling. Click on the cultural designs below to learn their philosophy, and compose your own modern textiles using our digital weaving loom.",
    heritageDesign: "default",

    // Default Experiences Customization
    showExperiences: true,
    experiencesLabel: "What We Offer",
    experiencesTitle: "Every Visit Is a <span class=\"text-clay italic\">New Journey</span>",
    experiencesSubTitle: "Curated interactive clusters designed for self-discovery and immersive heritage learning.",

    // Default Exhibitions Customization
    showExhibitions: true,
    exhibitionsLabel: "Current & Upcoming",
    exhibitionsTitle: "Where Every Wall <br />Tells a <span class=\"text-terracotta italic\">Story</span>",
    exhibitionsSubTitle: "Our gallery rotates with living exhibitions that cross cultures, geographies, and generations. Touch, listen, edit, and discover.",

    // Default Schools Customization
    showSchools: true,
    schoolsLabel: "Who We Welcome",
    schoolsTitle: "Designed for Every <span class=\"text-clay italic\">Curious Mind</span>",
    schoolsSubTitle: "Whether you are an educator seeking curriculum-focused learning or a group seeking to build cultural intelligence, we have tailored path programs.",

    // Default Events Customization
    showEvents: true,
    eventsLabel: "Upcoming Sessions",
    eventsTitle: "What's <span class=\"text-clay italic\">On</span>",
    eventsSubTitle: "Reserve your spot in our upcoming heritage sessions, rhythm circles, and family celebrations."
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
      description: "A curated café space where food becomes storytelling — fibres, aromas, and gatherings inspired by global cultures."
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

const LOCAL_STORAGE_DB_KEY = "afro_baobab_cms_db";

function getLocalDb(): CmsData {
  const existing = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      // Smoothly populate missing brand and wallpaper customization keys
      if (parsed.header && (parsed.header.logoTextPrimary === undefined || parsed.header.showHeritage === undefined)) {
        parsed.header = { ...SEED_DATA.header, ...parsed.header };
        saveLocalDb(parsed);
      }
      return parsed;
    } catch (e) {
      console.error("Corrupted local storage database, resetting.", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(SEED_DATA));
  return SEED_DATA;
}

function saveLocalDb(db: CmsData) {
  localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(db));
}

// Check if Server/API is available. 
// If it's pure static (like standard GitHub pages/Vercel with no Node server), this lets us fallback automatically
async function isServerOnline(): Promise<boolean> {
  try {
    const res = await fetch("/api/cms/all", { method: "GET" });
    return res.ok && !!res.headers.get("content-type")?.includes("application/json");
  } catch {
    return false;
  }
}

export async function getCmsAll(): Promise<CmsData> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch("/api/cms/all");
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Express server load failed, falling back to LocalStorage.", e);
    }
  }
  return getLocalDb();
}

export async function updateCmsHeader(header: CmsHeader): Promise<{ success: boolean; header: CmsHeader }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch("/api/cms/header", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(header)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Express update failed, performing local storage save.", e);
    }
  }

  const db = getLocalDb();
  db.header = { ...header };
  saveLocalDb(db);
  return { success: true, header: db.header };
}

export async function cmsLogin(username: string, password: string): Promise<{ success: boolean; token: string }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        return await res.json();
      }
      const errRes = await res.json();
      throw new Error(errRes.error || "Authentication failed");
    } catch (e) {
      if (username === "admin" && password === "admin") {
        return { success: true, token: "afro-baobab-auth-session" };
      }
      throw e;
    }
  }

  if (username === "admin" && password === "admin") {
    return { success: true, token: "afro-baobab-auth-session" };
  }
  throw new Error("Incorrect login credentials.");
}

// Experiences Edit/Add/Delete
export async function saveCmsExperience(id: string | null, data: Partial<Experience>): Promise<{ success: boolean; item: Experience }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const url = id ? `/api/cms/experiences/${id}` : "/api/cms/experiences";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server save experience failed, doing local", e);
    }
  }

  const db = getLocalDb();
  if (id) {
    const idx = db.experiences.findIndex(x => x.id === id);
    if (idx !== -1) {
      db.experiences[idx] = { ...db.experiences[idx], ...data };
      saveLocalDb(db);
      return { success: true, item: db.experiences[idx] };
    }
  }
  const newItem: Experience = {
    id: "exp-" + Date.now(),
    number: data.number || String(db.experiences.length + 1).padStart(2, "0"),
    title: data.title || "Untitled Experience",
    description: data.description || "",
    imageUrl: data.imageUrl || ""
  };
  db.experiences.push(newItem);
  saveLocalDb(db);
  return { success: true, item: newItem };
}

export async function deleteCmsExperience(id: string): Promise<{ success: boolean }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch(`/api/cms/experiences/${id}`, { method: "DELETE" });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server delete experience failed, doing local", e);
    }
  }

  const db = getLocalDb();
  db.experiences = db.experiences.filter(x => x.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// Exhibitions Edit/Add/Delete
export async function saveCmsExhibition(id: string | null, data: Partial<Exhibition>): Promise<{ success: boolean; item: Exhibition }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const url = id ? `/api/cms/exhibitions/${id}` : "/api/cms/exhibitions";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server save exhibition failed, doing local", e);
    }
  }

  const db = getLocalDb();
  if (id) {
    const idx = db.exhibitions.findIndex(x => x.id === id);
    if (idx !== -1) {
      db.exhibitions[idx] = { ...db.exhibitions[idx], ...data };
      saveLocalDb(db);
      return { success: true, item: db.exhibitions[idx] };
    }
  }
  const newItem: Exhibition = {
    id: "exh-" + Date.now(),
    badge: data.badge || "NEW",
    title: data.title || "Untitled Exhibition",
    type: data.type || "",
    status: data.status || "Soon",
    isNow: data.isNow ?? false,
    imageUrl: data.imageUrl || ""
  };
  db.exhibitions.push(newItem);
  saveLocalDb(db);
  return { success: true, item: newItem };
}

export async function deleteCmsExhibition(id: string): Promise<{ success: boolean }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch(`/api/cms/exhibitions/${id}`, { method: "DELETE" });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server delete exhibition failed, doing local", e);
    }
  }

  const db = getLocalDb();
  db.exhibitions = db.exhibitions.filter(x => x.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// Events Edit/Add/Delete
export async function saveCmsEvent(id: string | null, data: Partial<EventItem>): Promise<{ success: boolean; item: EventItem }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const url = id ? `/api/cms/events/${id}` : "/api/cms/events";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server save event failed, doing local", e);
    }
  }

  const db = getLocalDb();
  if (id) {
    const idx = db.events.findIndex(x => x.id === id);
    if (idx !== -1) {
      db.events[idx] = { ...db.events[idx], ...data } as EventItem;
      saveLocalDb(db);
      return { success: true, item: db.events[idx] };
    }
  }
  const newItem: EventItem = {
    id: "ev-" + Date.now(),
    day: data.day || "01",
    month: data.month || "Jan",
    category: data.category || "General Event",
    title: data.title || "Untitled Event",
    time: data.time || "12:00 PM",
    audience: data.audience || "All Welcome",
    theme: data.theme || "clay",
    imageUrl: data.imageUrl || ""
  };
  db.events.push(newItem);
  saveLocalDb(db);
  return { success: true, item: newItem };
}

export async function deleteCmsEvent(id: string): Promise<{ success: boolean }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch(`/api/cms/events/${id}`, { method: "DELETE" });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server delete event failed, doing local", e);
    }
  }

  const db = getLocalDb();
  db.events = db.events.filter(x => x.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// Inquiries / Bookings Submit/Update/Delete
export async function saveCmsBooking(bookingData: Partial<Booking>): Promise<{ success: boolean; booking: Booking }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server submit inquiry failed, doing local", e);
    }
  }

  const db = getLocalDb();
  const newBooking: Booking = {
    id: "bk-" + Date.now(),
    name: bookingData.name || "Anonymous Guest",
    email: bookingData.email || "",
    phone: bookingData.phone || "",
    type: bookingData.type || "general",
    notes: bookingData.notes || "",
    status: "unread",
    timestamp: new Date().toISOString()
  };
  db.bookings.push(newBooking);
  saveLocalDb(db);
  return { success: true, booking: newBooking };
}

export async function updateCmsBookingStatus(id: string, status: "unread" | "read" | "completed"): Promise<{ success: boolean; booking: Booking }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch(`/api/cms/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server update booking failed, doing local", e);
    }
  }

  const db = getLocalDb();
  const idx = db.bookings.findIndex(x => x.id === id);
  if (idx !== -1) {
    db.bookings[idx] = { ...db.bookings[idx], status };
    saveLocalDb(db);
    return { success: true, booking: db.bookings[idx] };
  }
  throw new Error("Booking not found");
}

export async function deleteCmsBooking(id: string): Promise<{ success: boolean }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch(`/api/cms/bookings/${id}`, { method: "DELETE" });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server delete booking failed, doing local", e);
    }
  }

  const db = getLocalDb();
  db.bookings = db.bookings.filter(x => x.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// Upload Client Image handler
export async function uploadCmsImage(name: string, base64Data: string): Promise<{ success: boolean; url?: string; error?: string }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch("/api/cms/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, data: base64Data })
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      return { success: false, error: err.error || "Upload failed" };
    } catch (e: any) {
      console.warn("Upload server connection failed, falling back to local base64 simulation.", e);
    }
  }
  // If offline/local, return base64 string directly so it is cached in the storage DB seamlessly!
  return { success: true, url: base64Data };
}

// Custom Page CRUD triggers
export async function saveCmsPage(id: string | null, pageData: Partial<CustomPage>): Promise<{ success: boolean; page: CustomPage }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const url = id ? `/api/cms/pages/${id}` : "/api/cms/pages";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server save custom page failed, executing local storage updates.", e);
    }
  }

  const db = getLocalDb();
  if (!db.customPages) db.customPages = [];

  const cleanSlug = (pageData.slug || "new-page").toLowerCase().replace(/[^a-z0-9-_]/g, "-");

  if (id) {
    const idx = db.customPages.findIndex(p => p.id === id);
    if (idx !== -1) {
      db.customPages[idx] = {
        ...db.customPages[idx],
        ...pageData,
        slug: cleanSlug
      };
      saveLocalDb(db);
      return { success: true, page: db.customPages[idx] };
    }
  }

  const newPage: CustomPage = {
    id: "page-" + Date.now(),
    slug: cleanSlug,
    title: pageData.title || "Untitled Page",
    content: pageData.content || "Use our CMS dashboard to add markdown/HTML text.",
    shownInNavbar: pageData.shownInNavbar ?? true,
    createdAt: new Date().toISOString()
  };
  db.customPages.push(newPage);
  saveLocalDb(db);
  return { success: true, page: newPage };
}

export async function deleteCmsPage(id: string): Promise<{ success: boolean }> {
  const online = await isServerOnline();
  if (online) {
    try {
      const res = await fetch(`/api/cms/pages/${id}`, { method: "DELETE" });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Server delete custom page failed, doing local", e);
    }
  }

  const db = getLocalDb();
  if (!db.customPages) db.customPages = [];
  db.customPages = db.customPages.filter(p => p.id !== id);
  saveLocalDb(db);
  return { success: true };
}
