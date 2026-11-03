export type SkillGroup = {
  id: string;
  label: string;
  note: string;
  items: { name: string; level?: 1 | 2 | 3 | 4 | 5 }[];
};

/** No invented percentages — levels are honest relative confidence (1–5). */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    note: "Daily drivers",
    items: [
      { name: "Python", level: 5 },
      { name: "SQL", level: 5 },
      { name: "TypeScript", level: 3 },
      { name: "JavaScript", level: 3 },
      { name: "Java", level: 3 },
    ],
  },
  {
    id: "analytics",
    label: "Analytics & BI",
    note: "Where I started",
    items: [
      { name: "Power BI", level: 5 },
      { name: "Excel", level: 4 },
      { name: "Tableau", level: 4 },
      { name: "EDA", level: 5 },
      { name: "RFM Segmentation", level: 4 },
    ],
  },
  {
    id: "iot",
    label: "IoT & Edge",
    note: "My specialisation",
    items: [
      { name: "ESP32", level: 4 },
      { name: "Arduino IDE", level: 4 },
      { name: "GPS (Neo-6M)", level: 4 },
      { name: "Accelerometer (MPU6050)", level: 4 },
      { name: "Bluetooth / BLE", level: 3 },
    ],
  },
  {
    id: "ml",
    label: "Machine Learning",
    note: "Predict, then explain",
    items: [
      { name: "Scikit-Learn", level: 4 },
      { name: "Regression", level: 4 },
      { name: "Classification", level: 4 },
      { name: "Model Evaluation", level: 4 },
      { name: "Explainability (XAI)", level: 3 },
    ],
  },
  {
    id: "dataeng",
    label: "Data Engineering",
    note: "Moving and cleaning at scale",
    items: [
      { name: "ETL Pipelines", level: 4 },
      { name: "PySpark", level: 3 },
      { name: "Data Cleaning", level: 5 },
      { name: "Data Wrangling", level: 4 },
      { name: "PostgreSQL", level: 4 },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Tools",
    note: "Shipping it",
    items: [
      { name: "AWS (S3, Athena)", level: 3 },
      { name: "Supabase", level: 4 },
      { name: "Docker", level: 3 },
      { name: "Git & GitHub", level: 4 },
      { name: "Flask", level: 4 },
      { name: "React", level: 4 },
    ],
  },
];
