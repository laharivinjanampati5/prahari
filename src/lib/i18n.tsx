import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "en" | "hi";

const DICT = {
  home: { en: "Home", hi: "मुखपृष्ठ" },
  forecasts: { en: "Forecasts", hi: "पूर्वानुमान" },
  warnings: { en: "Warnings", hi: "चेतावनियाँ" },
  tracker: { en: "Extreme Weather Tracker", hi: "चरम मौसम ट्रैकर" },
  weightMaps: { en: "Weight Maps", hi: "भार मानचित्र" },
  api: { en: "Alerts API", hi: "अलर्ट एपीआई" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  about: { en: "About", hi: "परिचय" },
  contact: { en: "Contact", hi: "संपर्क" },
  gov: { en: "Government of India", hi: "भारत सरकार" },
  moes: { en: "Ministry of Earth Sciences", hi: "पृथ्वी विज्ञान मंत्रालय" },
  mic: { en: "Ministry of Education's Innovation Cell (MIC)", hi: "शिक्षा मंत्रालय नवाचार प्रकोष्ठ (MIC)" },
  operational: { en: "System Operational", hi: "प्रणाली सक्रिय" },
  lastUpdated: { en: "Last Updated", hi: "अंतिम अद्यतन" },
  search: { en: "Search location…", hi: "स्थान खोजें…" },
  heroTitle: {
    en: "AI-Driven Spatio-Temporal Tracking of Extreme Weather Anomalies",
    hi: "चरम मौसम विसंगतियों की एआई-आधारित स्थानिक-कालिक ट्रैकिंग",
  },
  heroSub: {
    en: "From 12 km Global Ensemble to 5 km Hyper-Local Threat Tracking in 3–10 Day Forecasts",
    hi: "12 किमी वैश्विक एन्सेम्बल से 5 किमी अति-स्थानीय खतरा ट्रैकिंग — 3–10 दिन का पूर्वानुमान",
  },
  viewAlerts: { en: "View Live Alerts", hi: "लाइव अलर्ट देखें" },
  exploreWeights: { en: "Explore Weight Maps", hi: "भार मानचित्र देखें" },
  apiDocs: { en: "API Documentation", hi: "एपीआई दस्तावेज़" },
  latest: { en: "Latest", hi: "ताज़ा" },
} as const;

export type TKey = keyof typeof DICT;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => DICT[k].en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <Ctx.Provider value={{ lang, setLang, t: (k) => DICT[k][lang] }}>{children}</Ctx.Provider>
  );
}

export const useI18n = () => useContext(Ctx);
