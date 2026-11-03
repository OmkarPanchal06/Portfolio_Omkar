export const profile = {
  name: "Omkar Panchal",
  first: "Omkar",
  last: "Panchal",
  initials: "OP",
  eyebrow: "B.Tech CSE (IoT) · Class of 2027 · YCCE Nagpur",
  headline: ["I build things that", "sense, move,", "and decide."],
  lede:
    "Final-year Computer Science engineer specialising in the Internet of Things, with internship experience across Business Intelligence, Data Analytics and Machine Learning. I wire real sensors to real data systems — then make them useful.",
  email: "omkarbpanchal23@gmail.com",
  phone: "+91 7822971970",
  phoneHref: "+917822971970",
  location: "Nagpur, Maharashtra, India",
  links: {
    github: "https://github.com/OmkarPanchal06",
    linkedin: "https://www.linkedin.com/in/omkar-panchal/",
    resume: "/resume.pdf",
  },

  stats: [
    { value: "8.14", unit: "/10", label: "CGPA" },
    { value: "15+", unit: "", label: "Hackathons" },
    { value: "38", unit: "", label: "Repos shipped" },
    { value: "2", unit: "", label: "Industry internships" },
  ],

  pillars: [
    {
      id: "iot",
      index: "01",
      title: "IoT Systems",
      body: "ESP32 firmware, GPS and accelerometer telemetry, Bluetooth device pairing — edge hardware that streams straight into cloud pipelines with Supabase real-time sync.",
      stack: ["ESP32", "Arduino IDE", "Neo-6M GPS", "MPU6050", "BLE"],
      accent: "signal" as const,
    },
    {
      id: "data",
      index: "02",
      title: "Data & ML Pipelines",
      body: "ETL workflows, RFM segmentation, AWS Athena and S3, scikit-learn models with real evaluation — the analytics layer that turns raw records into decisions.",
      stack: ["Python", "SQL", "PySpark", "AWS", "scikit-learn"],
      accent: "amber" as const,
    },
    {
      id: "product",
      index: "03",
      title: "Full-Stack Products",
      body: "React and Flask interfaces with real authentication and dashboards — because an insight nobody can use isn't finished yet.",
      stack: ["React", "Flask", "Power BI", "Supabase", "Docker"],
      accent: "violet" as const,
    },
  ],

  experience: [
    {
      role: "Data Analyst",
      org: "Analytics Career Connect (ACC)",
      mode: "Remote · Part-Time",
      from: "May 2026",
      to: "Present",
      kind: "experience" as const,
      points: [
        "Developed Power BI dashboards and KPI reports to support business decision-making.",
        "Performed data cleaning, transformation, and exploratory data analysis using Python and SQL.",
        "Collaborated with cross-functional teams to automate reporting workflows.",
      ],
    },
    {
      role: "Data Analyst Intern",
      org: "Infotact Solutions",
      mode: "Remote",
      from: "Dec 2025",
      to: "Mar 2026",
      kind: "experience" as const,
      points: [
        "Developed RFM-based customer segmentation using Python and SQL.",
        "Built interactive dashboards using Power BI for business reporting.",
        "Queried cloud datasets using AWS Athena, Amazon S3, and PySpark.",
      ],
    },
    {
      role: "B.Tech · Computer Science Engineering (IoT)",
      org: "Yeshwantrao Chavan College of Engineering, Nagpur",
      mode: "Full-time",
      from: "Aug 2023",
      to: "Jul 2027",
      kind: "education" as const,
      points: [
        "CGPA: 8.14 / 10",
        "Specialisation in Internet of Things",
      ],
    },
  ],

  achievements: [
    { title: "1st Prize — LaunchX National-Level Hackathon", body: "AI Startup-Investor Matchmaking platform, built with Team Hawks." },
    { title: "Winner — AI & Machine Learning Hackathon", body: "Recommendation workflows for startup profiling and investor matching." },
    { title: "Group Leader — Analytics Career Connect", body: "Led interns, coordinated analytics projects, mentored members in Python, SQL and Power BI." },
    { title: "15+ Hackathon Experiences", body: "Competitive events building AI, data analytics and full-stack solutions." },
  ],

  certifications: [
    { name: "Data Analytics Job Simulation", org: "Deloitte Australia · Forage" },
    { name: "Data Analysis and Decision Making", org: "NPTEL" },
  ],
} as const;

export type Profile = typeof profile;
