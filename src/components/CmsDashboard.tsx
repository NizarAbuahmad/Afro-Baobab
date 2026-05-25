import { useState, useEffect, FormEvent } from "react";
import { CmsData, Experience, Exhibition, EventItem, Booking } from "../types";
import { 
  X, Check, Trash2, Plus, LogOut, Settings, 
  BookOpen, Calendar, HelpCircle, Mail, Phone,
  Bookmark, Edit3, ArrowRight, ShieldCheck, Lock, Unlock 
} from "lucide-react";

interface CmsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  data: CmsData | null;
  onRefresh: () => void;
}

type TabType = "general" | "experiences" | "exhibitions" | "events" | "bookings";

export default function CmsDashboard({ isOpen, onClose, data, onRefresh }: CmsDashboardProps) {
  const [sessionToken, setSessionToken] = useState<string | null>(
    localStorage.getItem("afro_baobab_cms_session")
  );

  // Auth local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>("general");

  // Edit Forms state
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSub, setHeroSub] = useState("");
  const [footerDesc, setFooterDesc] = useState("");
  const [footerTagline, setFooterTagline] = useState("");
  const [tickerInput, setTickerInput] = useState("");
  
  // Dynamic Item states
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expNum, setExpNum] = useState("");

  const [exhBadge, setExhBadge] = useState("");
  const [exhTitle, setExhTitle] = useState("");
  const [exhType, setExhType] = useState("");
  const [exhStatus, setExhStatus] = useState("");
  const [exhIsNow, setExhIsNow] = useState(false);

  const [evDay, setEvDay] = useState("");
  const [evMonth, setEvMonth] = useState("");
  const [evTitle, setEvTitle] = useState("");
  const [evCat, setEvCat] = useState("");
  const [evTime, setEvTime] = useState("");
  const [evAudience, setEvAudience] = useState("");
  const [evTheme, setEvTheme] = useState<'clay' | 'moss' | 'indigo'>("clay");

  // Load Initial states when data loads
  useEffect(() => {
    if (data) {
      setHeroTitle(data.header.heroTitle);
      setHeroSub(data.header.heroSub);
      setFooterDesc(data.header.footerDesc);
      setFooterTagline(data.header.footerTagline);
      setTickerInput(data.header.tickerItems.join(", "));
    }
  }, [data]);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const result = await res.json();
        localStorage.setItem("afro_baobab_cms_session", result.token);
        setSessionToken(result.token);
        onRefresh();
      } else {
        const errResult = await res.json();
        setAuthError(errResult.error || "Incorrect login credentials.");
      }
    } catch (err) {
      setAuthError("Failed to communicate with authentication server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("afro_baobab_cms_session");
    setSessionToken(null);
    onRefresh();
  };

  // Save general header configuration
  const handleSaveHeader = async () => {
    try {
      const res = await fetch("/api/cms/header", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroTitle,
          heroSub,
          footerDesc,
          footerTagline,
          tickerItems: tickerInput.split(",").map(x => x.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        alert("Homepage configuration saved successfully!");
        onRefresh();
      }
    } catch (err) {
      alert("Failed to save changes.");
    }
  };

  // Add/Update Experience
  const handleSaveExperience = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingItemId 
      ? `/api/cms/experiences/${editingItemId}` 
      : "/api/cms/experiences";
    const method = editingItemId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: expTitle, description: expDesc, number: expNum })
      });

      if (res.ok) {
        setExpTitle("");
        setExpDesc("");
        setExpNum("");
        setEditingItemId(null);
        onRefresh();
      }
    } catch (err) {
      alert("Failed to save experience.");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience zone?")) return;
    try {
      const res = await fetch(`/api/cms/experiences/${id}`, { method: "DELETE" });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // Add/Update Exhibition
  const handleSaveExhibition = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingItemId 
      ? `/api/cms/exhibitions/${editingItemId}` 
      : "/api/cms/exhibitions";
    const method = editingItemId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badge: exhBadge, title: exhTitle, type: exhType, status: exhStatus, isNow: exhIsNow })
      });

      if (res.ok) {
        setExhBadge("");
        setExhTitle("");
        setExhType("");
        setExhStatus("");
        setExhIsNow(false);
        setEditingItemId(null);
        onRefresh();
      }
    } catch (err) {
      alert("Failed to save exhibition.");
    }
  };

  const handleDeleteExhibition = async (id: string) => {
    if (!confirm("Delete this exhibition entry?")) return;
    try {
      const res = await fetch(`/api/cms/exhibitions/${id}`, { method: "DELETE" });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // Add/Update Event Item
  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingItemId 
      ? `/api/cms/events/${editingItemId}` 
      : "/api/cms/events";
    const method = editingItemId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          day: evDay, 
          month: evMonth, 
          title: evTitle, 
          category: evCat, 
          time: evTime, 
          audience: evAudience, 
          theme: evTheme 
        })
      });

      if (res.ok) {
        setEvDay("");
        setEvMonth("");
        setEvTitle("");
        setEvCat("");
        setEvTime("");
        setEvAudience("");
        setEvTheme("clay");
        setEditingItemId(null);
        onRefresh();
      }
    } catch (err) {
      alert("Failed to save event.");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event panel?")) return;
    try {
      const res = await fetch(`/api/cms/events/${id}`, { method: "DELETE" });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // Inquiries / Bookings Status changes
  const handleUpdateBookingStatus = async (id: string, status: 'read' | 'completed' | 'unread') => {
    try {
      const res = await fetch(`/api/cms/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Delete this booking request forever?")) return;
    try {
      const res = await fetch(`/api/cms/bookings/${id}`, { method: "DELETE" });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Failed to delete booking.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-ivory border border-sand/50 rounded-[4px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="bg-[#1f1610] text-white px-6 py-4 flex items-center justify-between border-b border-sand/20">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-clay animate-pulse" />
            <div>
              <h2 className="font-serif text-xl tracking-wide font-medium">
                Baobab CMS <span className="text-sand/50 text-sm font-light">Content Desk</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {sessionToken && (
              <button
                onClick={handleLogout}
                className="text-white/60 hover:text-clay text-xs tracking-wider uppercase font-mono flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In Case */}
        {!sessionToken ? (
          <div className="flex-1 bg-warm-white flex items-center justify-center p-8 sm:p-12">
            <div className="w-full max-w-md bg-white border border-sand/60 rounded-[3px] shadow-lg p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-clay/10 rounded-full flex items-center justify-center mx-auto mb-2 text-clay">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-light text-charcoal">Security Verification</h3>
                <p className="text-xs text-charcoal/50 mt-1 font-sans">
                  Please verify credentials to manage the active Afro Baobab landing content.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-[2px] mb-4 font-sans">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E.g. admin"
                    className="w-full bg-ivory/50 border border-sand/40 px-4 py-2.5 text-xs text-charcoal rounded-[2px] focus:outline-none focus:border-clay transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#333]/60 mb-1 font-mono font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="E.g. admin"
                    className="w-full bg-ivory/50 border border-sand/40 px-4 py-2.5 text-xs text-charcoal rounded-[2px] focus:outline-none focus:border-clay transition-colors"
                  />
                </div>

                <div className="bg-sand/20 rounded-[2px] p-2.5 text-[10px] text-clay/90 flex gap-2 items-start font-mono leading-relaxed">
                  <Unlock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span>Demo Credentials: Use username <strong className="font-bold">admin</strong> and password <strong className="font-bold">admin</strong></span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-clay hover:bg-terracotta disabled:bg-clay/50 text-white font-mono uppercase tracking-[0.12em] text-xs py-3 rounded-[2px] transition-colors cursor-pointer text-center font-medium shadow-md"
                >
                  {authLoading ? "Verifying Session ..." : "Unlock Content Manager"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard Dashboard Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Sidebar navigation tabs */}
            <div className="w-full md:w-60 bg-charcoal text-white flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-sand/10 overflow-x-auto md:overflow-x-visible">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap cursor-pointer ${
                  activeTab === "general"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings className="w-4 h-4 text-sand/60" /> General Settings
              </button>

              <button
                onClick={() => {
                  setActiveTab("experiences");
                  setEditingItemId(null);
                }}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap cursor-pointer ${
                  activeTab === "experiences"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-4 h-4 text-sand/60" /> Experiences
              </button>

              <button
                onClick={() => {
                  setActiveTab("exhibitions");
                  setEditingItemId(null);
                }}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap cursor-pointer ${
                  activeTab === "exhibitions"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-sand/60" /> Exhibitions
              </button>

              <button
                onClick={() => {
                  setActiveTab("events");
                  setEditingItemId(null);
                }}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap cursor-pointer ${
                  activeTab === "events"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calendar className="w-4 h-4 text-sand/60" /> Events
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 md:flex-none py-3.5 px-5 text-left text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2.5 transition-all text-nowrap relative cursor-pointer ${
                  activeTab === "bookings"
                    ? "bg-clay text-white shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Bookmark className="w-4 h-4 text-sand/60" /> Inquiries
                {data?.bookings && data.bookings.filter(b => b.status === 'unread').length > 0 && (
                  <span className="ml-auto bg-clay text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    {data.bookings.filter(b => b.status === 'unread').length}
                  </span>
                )}
              </button>
            </div>

            {/* Inner Desk Content */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-warm-white">
              {/* general */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-charcoal">Configure Homepage Texts</h3>
                    <p className="text-xs text-[#777] mt-1 font-sans">
                      Changes here update the live header layout, subtitles, rotating tickers and footer branding immediately.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                        Hero Main Title (HTML Supported)
                      </label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full bg-white border border-sand/50 px-4 py-2.5 text-xs text-charcoal rounded-[2px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                        Hero Subtitle Description
                      </label>
                      <textarea
                        rows={3}
                        value={heroSub}
                        onChange={(e) => setHeroSub(e.target.value)}
                        className="w-full bg-white border border-sand/50 px-4 py-2.5 text-xs text-charcoal rounded-[2px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Footer Description
                        </label>
                        <input
                          type="text"
                          value={footerDesc}
                          onChange={(e) => setFooterDesc(e.target.value)}
                          className="w-full bg-white border border-sand/50 px-4 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Footer Tagline slogan
                        </label>
                        <input
                          type="text"
                          value={footerTagline}
                          onChange={(e) => setFooterTagline(e.target.value)}
                          className="w-full bg-white border border-sand/50 px-4 py-2.5 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                        Rotating Ticker Items (comma-separated list)
                      </label>
                      <input
                        type="text"
                        value={tickerInput}
                        onChange={(e) => setTickerInput(e.target.value)}
                        className="w-full bg-white border border-sand/50 px-4 py-2.5 text-xs text-charcoal rounded-[2px]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveHeader}
                    className="bg-clay hover:bg-terracotta text-white font-mono uppercase tracking-widest text-xs px-6 py-3 rounded-[2px] transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* experiences */}
              {activeTab === "experiences" && (
                <div className="space-y-6">
                  {/* form */}
                  <form onSubmit={handleSaveExperience} className="bg-white border border-sand/40 p-4 rounded-[2px] space-y-4">
                    <h4 className="font-serif text-lg font-medium text-charcoal">
                      {editingItemId ? "Edit Experience Zone" : "+ Add Experience Zone"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Serial Display Code (E.g. 01)
                        </label>
                        <input
                          type="text"
                          required
                          value={expNum}
                          onChange={(e) => setExpNum(e.target.value)}
                          placeholder="E.g. 07"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Title
                        </label>
                        <input
                          type="text"
                          required
                          value={expTitle}
                          onChange={(e) => setExpTitle(e.target.value)}
                          placeholder="Zone Title name"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                        Brief description
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={expDesc}
                        onChange={(e) => setExpDesc(e.target.value)}
                        placeholder="Say what visitors can learn or experience here..."
                        className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-clay hover:bg-terracotta text-white font-mono uppercase text-xs tracking-widest px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
                      >
                        {editingItemId ? "Update Zone" : "Add Experience Zone"}
                      </button>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(null);
                            setExpTitle("");
                            setExpDesc("");
                            setExpNum("");
                          }}
                          className="bg-[#eee] hover:bg-[#ddd] text-[#333] font-mono uppercase text-xs tracking-widest px-4 py-2 rounded-[2px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-charcoal font-medium">Current Experience Cards ({data?.experiences.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data?.experiences.map((exp) => (
                        <div key={exp.id} className="p-4 bg-white border border-sand/30 rounded-[2px] flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1.5 border-b border-sand/10 pb-1.5">
                              <span className="font-serif text-clay text-sm font-medium">{exp.number}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingItemId(exp.id);
                                    setExpTitle(exp.title);
                                    setExpDesc(exp.description);
                                    setExpNum(exp.number);
                                  }}
                                  className="text-charcoal/40 hover:text-clay transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteExperience(exp.id)}
                                  className="text-charcoal/40 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <h5 className="font-serif text-charcoal font-medium text-base mb-1">{exp.title}</h5>
                            <p className="text-charcoal/60 text-xs leading-relaxed font-sans">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* exhibitions */}
              {activeTab === "exhibitions" && (
                <div className="space-y-6">
                  {/* form */}
                  <form onSubmit={handleSaveExhibition} className="bg-white border border-sand/40 p-4 rounded-[2px] space-y-4">
                    <h4 className="font-serif text-lg font-medium text-charcoal">
                      {editingItemId ? "Edit Exhibition" : "+ Add New Exhibition"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Badge Code (E.g. I, II, III)
                        </label>
                        <input
                          type="text"
                          required
                          value={exhBadge}
                          onChange={(e) => setExhBadge(e.target.value)}
                          placeholder="E.g. IV"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Exhibition Headline
                        </label>
                        <input
                          type="text"
                          required
                          value={exhTitle}
                          onChange={(e) => setExhTitle(e.target.value)}
                          placeholder="Title name"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Media/Type Categories
                        </label>
                        <input
                          type="text"
                          required
                          value={exhType}
                          onChange={(e) => setExhType(e.target.value)}
                          placeholder="E.g. Textile · Ceramics"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Time Slot Status / Tag
                        </label>
                        <input
                          type="text"
                          required
                          value={exhStatus}
                          onChange={(e) => setExhStatus(e.target.value)}
                          placeholder="E.g. Now, Soon, Jun 2025"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isNowChk"
                        checked={exhIsNow}
                        onChange={(e) => setExhIsNow(e.target.checked)}
                        className="accent-clay"
                      />
                      <label htmlFor="isNowChk" className="text-xs text-charcoal font-sans font-medium">
                        Active exhibition (Displays active tag style)
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-clay hover:bg-terracotta text-white font-mono uppercase text-xs tracking-widest px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
                      >
                        {editingItemId ? "Update Entry" : "Create Entry"}
                      </button>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(null);
                            setExhBadge("");
                            setExhTitle("");
                            setExhType("");
                            setExhStatus("");
                            setExhIsNow(false);
                          }}
                          className="bg-[#eee] hover:bg-[#ddd] text-[#333] font-mono uppercase text-xs tracking-widest px-4 py-2 rounded-[2px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-charcoal font-medium">Active Exhibitions ({data?.exhibitions.length})</h4>
                    <div className="bg-white border border-sand/30 rounded-[2px] divide-y divide-sand/10">
                      {data?.exhibitions.map((exh) => (
                        <div key={exh.id} className="p-4 flex items-center justify-between gap-4 hover:bg-ivory/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-clay text-white font-serif flex items-center justify-center text-xs font-medium">
                              {exh.badge}
                            </span>
                            <div>
                              <p className="font-serif text-charcoal text-sm font-medium">{exh.title}</p>
                              <p className="text-[11px] text-charcoal/40 font-mono mt-0.5">{exh.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-[2px] text-[10px] font-mono uppercase ${
                              exh.isNow ? "bg-clay text-white" : "bg-moss/10 text-moss"
                            }`}>
                              {exh.status}
                            </span>
                            <button
                              onClick={() => {
                                setEditingItemId(exh.id);
                                setExhBadge(exh.badge);
                                setExhTitle(exh.title);
                                setExhType(exh.type);
                                setExhStatus(exh.status);
                                setExhIsNow(exh.isNow);
                              }}
                              className="text-charcoal/40 hover:text-clay transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExhibition(exh.id)}
                              className="text-charcoal/40 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* events */}
              {activeTab === "events" && (
                <div className="space-y-6">
                  {/* form */}
                  <form onSubmit={handleSaveEvent} className="bg-white border border-sand/40 p-4 rounded-[2px] space-y-4">
                    <h4 className="font-serif text-lg font-medium text-charcoal">
                      {editingItemId ? "Edit Event" : "+ Add Planned Event"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Date Num (E.g. 24)
                        </label>
                        <input
                          type="text"
                          required
                          value={evDay}
                          onChange={(e) => setEvDay(e.target.value)}
                          placeholder="E.g. 24"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Month Tag (E.g. May)
                        </label>
                        <input
                          type="text"
                          required
                          value={evMonth}
                          onChange={(e) => setEvMonth(e.target.value)}
                          placeholder="E.g. May"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Event Category
                        </label>
                        <input
                          type="text"
                          required
                          value={evCat}
                          onChange={(e) => setEvCat(e.target.value)}
                          placeholder="E.g. Spoken Word, Talk, Concert"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Event Headline Title
                        </label>
                        <input
                          type="text"
                          required
                          value={evTitle}
                          onChange={(e) => setEvTitle(e.target.value)}
                          placeholder="Headline name"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Event Theme Gradient
                        </label>
                        <select
                          value={evTheme}
                          onChange={(e) => setEvTheme(e.target.value as any)}
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px] h-[34px]"
                        >
                          <option value="clay">Clay (Terracotta Warm)</option>
                          <option value="moss">Moss (Organic Sage)</option>
                          <option value="indigo">Indigo (Heritage Deep)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Time Schedule
                        </label>
                        <input
                          type="text"
                          required
                          value={evTime}
                          onChange={(e) => setEvTime(e.target.value)}
                          placeholder="E.g. 7:00 PM"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                          Target Audience
                        </label>
                        <input
                          type="text"
                          required
                          value={evAudience}
                          onChange={(e) => setEvAudience(e.target.value)}
                          placeholder="E.g. Families, Adults, Kids"
                          className="w-full bg-ivory/30 border border-sand/50 px-3 py-2 text-xs text-charcoal rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 font-mono">
                      <button
                        type="submit"
                        className="bg-clay hover:bg-terracotta text-white uppercase text-xs tracking-widest px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
                      >
                        {editingItemId ? "Save Event" : "Create Event"}
                      </button>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(null);
                            setEvDay("");
                            setEvMonth("");
                            setEvTitle("");
                            setEvCat("");
                            setEvTime("");
                            setEvAudience("");
                            setEvTheme("clay");
                          }}
                          className="bg-[#eee] hover:bg-[#ddd] text-[#333] uppercase text-xs tracking-widest px-4 py-2 rounded-[2px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-lg text-charcoal font-medium">Listed Events ({data?.events.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {data?.events.map((ev) => (
                        <div key={ev.id} className="bg-white border border-sand/20 rounded-[2px] overflow-hidden flex flex-col justify-between shadow-sm">
                          {/* Top background theme */}
                          <div className={`h-24 p-3 relative flex justify-end items-start ${
                            ev.theme === 'clay' ? 'bg-gradient-to-br from-clay to-terracotta' :
                            ev.theme === 'moss' ? 'bg-gradient-to-br from-moss to-[#202c1c]' :
                            'bg-gradient-to-br from-indigo to-[#0d1622]'
                          }`}>
                            {/* Date Badge */}
                            <div className="bg-black/30 backdrop-blur-sm text-white px-2 py-1 text-center rounded-[2px] min-w-[40px]">
                              <span className="font-serif text-sm font-semibold block leading-tight">{ev.day}</span>
                              <span className="text-[9px] tracking-wider uppercase opacity-80 block">{ev.month}</span>
                            </div>

                            <div className="absolute left-3 bottom-2 flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingItemId(ev.id);
                                  setEvDay(ev.day);
                                  setEvMonth(ev.month);
                                  setEvTitle(ev.title);
                                  setEvCat(ev.category);
                                  setEvTime(ev.time);
                                  setEvAudience(ev.audience);
                                  setEvTheme(ev.theme);
                                }}
                                className="text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(ev.id)}
                                className="text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Body details */}
                          <div className="p-3.5 space-y-1">
                            <span className="text-[9px] font-mono tracking-widest text-clay uppercase block font-semibold">{ev.category}</span>
                            <h5 className="font-serif text-charcoal font-medium text-sm leading-tight line-clamp-1">{ev.title}</h5>
                            <div className="text-[10px] text-charcoal/50 flex gap-2 font-mono">
                              <span>{ev.time}</span>
                              <span>·</span>
                              <span>{ev.audience}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-charcoal">Inquiries &amp; Booking Desk</h3>
                    <p className="text-xs text-[#777] mt-1 font-sans">
                      Track and manage incoming visitor bookings, corporate proposals, and educators scheduling requests.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {data?.bookings && data.bookings.length === 0 ? (
                      <div className="text-center py-10 bg-white border border-sand/20 rounded-[2px]">
                        <p className="text-sm text-charcoal/40 font-serif">Inbox is currently empty.</p>
                      </div>
                    ) : (
                      data?.bookings.slice().reverse().map((bk) => (
                        <div key={bk.id} className={`p-5 bg-white border rounded-[3px] space-y-3 shadow-sm transition-all ${
                          bk.status === 'unread' ? 'border-clay/60 bg-clay/[0.01]' : 'border-sand/30'
                        }`}>
                          {/* Booking general details */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-mono tracking-widest uppercase font-semibold text-white px-2 py-0.5 rounded-[2px] ${
                                  bk.type === 'school' ? 'bg-indigo' : bk.type === 'corporate' ? 'bg-charcoal' : 'bg-clay'
                                }`}>
                                  {bk.type === 'school' ? 'School Visit' : bk.type === 'corporate' ? 'Corporate DEI' : 'Public Inquiry'}
                                </span>
                                <span className="text-[10px] text-charcoal/40 font-mono">
                                  {new Date(bk.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <h4 className="font-serif text-charcoal font-medium text-lg leading-tight">{bk.name}</h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                              {/* Status toggles */}
                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, bk.status === 'unread' ? 'read' : 'unread')}
                                className={`px-2.5 py-1 rounded-[2px] border transition-colors cursor-pointer ${
                                  bk.status === 'unread' 
                                    ? 'bg-clay/10 text-clay border-clay/20 hover:bg-clay/20' 
                                    : 'bg-[#eee] text-[#555] border-[#ddd] hover:bg-[#e4e4e4]'
                                }`}
                              >
                                {bk.status === 'unread' ? 'Mark Read' : 'Unread'}
                              </button>

                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, bk.status === 'completed' ? 'read' : 'completed')}
                                className={`px-2.5 py-1 rounded-[2px] border transition-all cursor-pointer ${
                                  bk.status === 'completed'
                                    ? 'bg-moss text-white border-moss hover:bg-moss/90'
                                    : 'border-sand/60 text-charcoal/60 hover:border-moss hover:text-moss'
                                }`}
                              >
                                {bk.status === 'completed' ? 'Completed ✓' : 'Mark Completed'}
                              </button>

                              <button
                                onClick={() => handleDeleteBooking(bk.id)}
                                className="p-1 px-2 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 rounded-[2px] transition-colors cursor-pointer"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* contact desk details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-y border-sand/10 py-2.5 mt-2 bg-ivory-[0.1] font-mono">
                            <div className="flex items-center gap-2 text-charcoal/70">
                              <Mail className="w-3.5 h-3.5 text-charcoal/40" />
                              <span>{bk.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-charcoal/70">
                              <Phone className="w-3.5 h-3.5 text-charcoal/40" />
                              <span>{bk.phone}</span>
                            </div>
                          </div>

                          {/* user notes */}
                          <div className="pt-2 text-xs text-charcoal/80 font-sans tracking-wide leading-relaxed pl-3 border-l-2 border-clay/30 italic">
                            "{bk.notes}"
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
