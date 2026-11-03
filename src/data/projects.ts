export type Accent = "signal" | "amber" | "violet" | "rose";

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  year: string;
  kind: string;
  accent: Accent;
  /** set true for the oversized hero card */
  featured?: boolean;
  stack: string[];
  metrics: { value: string; label: string }[];
  body: string;
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    id: "carbon",
    index: "01",
    name: "Real-Time Carbon Footprint Monitoring",
    tagline: "ESP32 → Flask → Supabase, with an ML model that takes over at 5k rows",
    year: "2025",
    kind: "IoT · ML · Full-stack",
    accent: "signal",
    featured: true,
    stack: ["ESP32", "Flask", "Supabase", "scikit-learn", "React", "Chart.js"],
    metrics: [
      { value: "3", label: "Sensors fused" },
      { value: "5,000", label: "Rows to auto-handoff" },
      { value: "4", label: "Contributors" },
      { value: "Live", label: "Real-time sync" },
    ],
    body:
      "An end-to-end emissions tracking system built for the Infotsav'25 hackathon at ABV-IIITM, Gwalior. An ESP32 pairs over Bluetooth and fuses GPS (Neo-6M) with accelerometer (MPU6050) data to detect travel distance, speed and transport mode automatically — no manual logging. Telemetry lands in Supabase with a timestamp and user id, where a Flask API scores it against scientifically validated emission factors. Below 5,000 records the model is rule-based; past that it switches to a scikit-learn estimator trained on real user data. Leaderboards, Carbon Credit Coins and community competitions close the loop on behaviour change.",
    repo: "https://github.com/OmkarPanchal06/Hackatron_TeamHawks",
  },
  {
    id: "mediflow",
    index: "02",
    name: "MediFlow Cloud",
    tagline: "Healthcare analytics on AWS Athena and S3",
    year: "2026",
    kind: "Data Engineering",
    accent: "amber",
    stack: ["Python", "SQL", "AWS Athena", "Amazon S3", "Power BI"],
    metrics: [
      { value: "30d", label: "Readmission risk" },
      { value: "14", label: "Data-quality rules" },
    ],
    body:
      "Healthcare analytics covering patient readmission and resource utilisation. Raw records are processed through Python and SQL into Amazon S3, queried serverlessly with Athena, then surfaced as Power BI dashboards for KPI tracking.",
    repo: "https://github.com/OmkarPanchal06/MediFlow",
  },
  {
    id: "dia",
    index: "03",
    name: "DiaInsights",
    tagline: "Diabetes decision-support system",
    year: "2026",
    kind: "Health · TypeScript",
    accent: "rose",
    stack: ["TypeScript", "React", "ML", "Data Viz"],
    metrics: [
      { value: "TS", label: "End-to-end typed" },
      { value: "Explainable", label: "Model outputs" },
    ],
    body:
      "A decision-support interface that turns diabetes risk predictions into something clinicians and patients can act on, pairing model output with explainable reasoning rather than a bare score.",
    repo: "https://github.com/OmkarPanchal06/DiaInsights",
  },
  {
    id: "rfm",
    index: "04",
    name: "Consumer360 RFM Analytics",
    tagline: "Enterprise customer segmentation & lifetime value",
    year: "2026",
    kind: "Analytics",
    accent: "violet",
    stack: ["Python", "SQL", "RFM", "Dashboards"],
    metrics: [
      { value: "LTV", label: "Value engine" },
      { value: "RFM", label: "Segmentation" },
    ],
    body:
      "A segmentation and lifetime-value engine built from the same RFM methodology used during my Infotact internship — scoring recency, frequency and monetary value to cluster customers into actionable tiers.",
    repo: "https://github.com/OmkarPanchal06/Consumer360-RFM-Analytics",
  },
  {
    id: "xai",
    index: "05",
    name: "Diabetes Prediction XAI",
    tagline: "Making the black box legible",
    year: "2026",
    kind: "Explainable AI",
    accent: "signal",
    stack: ["Python", "Scikit-Learn", "SHAP-style Explainability", "Streamlit"],
    metrics: [
      { value: "Local", label: "Per-record explanations" },
      { value: "Global", label: "Feature importance" },
    ],
    body:
      "A prediction dashboard that refuses to show a number without a reason — surfacing which features drove each diabetes prediction, at both the individual record and whole-model level.",
    repo: "https://github.com/OmkarPanchal06/XAI",
  },
  {
    id: "skillswap",
    index: "06",
    name: "Skillswap",
    tagline: "Peer-to-peer skill exchange platform",
    year: "2026",
    kind: "Full-stack",
    accent: "amber",
    stack: ["React 19", "Vite", "Express", "MongoDB"],
    metrics: [
      { value: "MERN", label: "Architecture" },
      { value: "REST", label: "API design" },
    ],
    body:
      "A full-stack marketplace where people trade skills rather than money, with authentication, listings and request flows across a React 19 front end and an Express/MongoDB API.",
    repo: "https://github.com/OmkarPanchal06/Skillswap",
  },
];
