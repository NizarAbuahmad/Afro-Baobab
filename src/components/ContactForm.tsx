import { useState, FormEvent } from "react";
import { Mail, Phone, User, Calendar, MessageSquare, X, CheckCircle, ArrowUpRight } from "lucide-react";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'school' | 'corporate' | 'general';
}

export default function ContactForm({ isOpen, onClose, defaultType = 'general' }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<'school' | 'corporate' | 'general'>(defaultType);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, type, notes })
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setNotes("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Server connection failed. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg bg-warm-white border border-sand rounded-[3px] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal/50 hover:text-clay transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-clay animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-2 font-medium">Inquiry Received</h3>
            <p className="text-[#6a6059] text-sm max-w-sm mx-auto leading-relaxed mb-6">
              Thank you for reaching out to Afro Baobab Cultural Hub. Our cultural concierge team will contact you shortly to confirm your booking and craft your personalized experience.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="bg-clay hover:bg-terracotta text-white px-6 py-2.5 rounded-[2px] text-xs font-mono tracking-widest uppercase transition-all"
            >
              Back to Hub
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="label">Custom Experience</div>
              <h3 className="font-serif text-3xl font-light text-charcoal tracking-tight">
                Plan a <em>Visit</em>
              </h3>
              <p className="text-xs text-[#777] mt-1 leading-relaxed font-sans">
                Tell us about your ideal day, group size, and specific requirements. We will tailor an immersive session matching your objectives.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-[2px]">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Type selector buttons */}
              <div className="grid grid-cols-3 gap-2">
                {(['general', 'school', 'corporate'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 px-3 text-xs tracking-wider uppercase border text-center transition-all cursor-pointer rounded-[2px] font-sans font-medium ${
                      type === t
                        ? "bg-clay border-clay text-white"
                        : "border-sand/60 bg-white text-charcoal/70 hover:border-clay hover:text-clay"
                    }`}
                  >
                    {t === 'general' ? 'Public' : t === 'school' ? 'Schools' : 'Corporate'}
                  </button>
                ))}
              </div>

              {/* Name */}
              <div className="relative">
                <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-charcoal/30" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Dr. Sarah Al-Mansoori"
                    className="w-full bg-white border border-sand/50 pl-10 pr-4 py-2.5 text-xs text-charcoal rounded-[2px] focus:outline-none focus:border-clay transition-colors"
                  />
                </div>
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-charcoal/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full bg-white border border-sand/50 pl-10 pr-4 py-2.5 text-xs text-charcoal rounded-[2px] focus:outline-none focus:border-clay transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-charcoal/30" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-white border border-sand/50 pl-10 pr-4 py-2.5 text-xs text-charcoal rounded-[2px] focus:outline-none focus:border-clay transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Message Notes */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-charcoal/60 mb-1 font-mono font-medium">
                  {type === 'school'
                    ? 'Class details, group sizes & grade levels'
                    : type === 'corporate'
                    ? 'DEI / Team development focus areas'
                    : 'Your inquiry notes'}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-charcoal/30" />
                  <textarea
                    rows={3}
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What specific themes, year-groups, timing preferences, or interactive zones are you interested in?"
                    className="w-full bg-white border border-sand/50 pl-10 pr-4 py-2.5 text-xs text-charcoal rounded-[2px] focus:outline-none focus:border-clay transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clay hover:bg-terracotta disabled:bg-clay/50 text-white font-mono uppercase tracking-[0.14em] text-xs py-3 rounded-[2px] font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span>Submitting ...</span>
              ) : (
                <>
                  <span>Submit Inquiry</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
