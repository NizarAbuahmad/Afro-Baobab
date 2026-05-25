export interface CmsHeader {
  heroTitle: string;
  heroSub: string;
  tickerItems: string[];
  footerDesc: string;
  footerTagline: string;
}

export interface Experience {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface Exhibition {
  id: string;
  badge: string;
  title: string;
  type: string;
  status: string;
  isNow: boolean;
}

export interface EventItem {
  id: string;
  day: string;
  month: string;
  category: string;
  title: string;
  time: string;
  audience: string;
  theme: 'clay' | 'moss' | 'indigo';
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'school' | 'corporate' | 'general';
  notes: string;
  status: 'unread' | 'read' | 'completed';
  timestamp: string;
}

export interface CmsData {
  header: CmsHeader;
  experiences: Experience[];
  exhibitions: Exhibition[];
  events: EventItem[];
  bookings: Booking[];
}
