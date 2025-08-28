import styles from "./About.module.css";

const aboutData = [
  {
    title: "Our Mission",
    description:
      "TutorBridge connects students and tutors in a seamless, secure, and friendly environment. Our mission is to empower learners and educators with the tools they need to succeed.",
    icon: "🎯",
  },
  {
    title: "Features",
    description:
      "- Secure authentication\n- Real-time messaging\n- Personalized tutor matching\n- Progress tracking\n- Modern, responsive design",
    icon: "✨",
  },
  {
    title: "Meet the Team",
    description:
      "A passionate group of developers, educators, and designers dedicated to making learning accessible for everyone.",
    icon: "🤝",
  },
];

function About() {
  return (
    <div className={styles.aboutPage}>
      <h1 className={styles.aboutTitle}>About TutorBridge</h1>
      <p className={styles.aboutSubtitle}>
        Bridging the gap between students and tutors with technology, innovation, and care.
      </p>
      <div className={styles.aboutCards}>
        {aboutData.map((item, idx) => (
          <div
            key={idx}
            className={styles.aboutCard}
          >
            <div className={styles.aboutIcon}>{item.icon}</div>
            <h2 className={styles.aboutCardTitle}>{item.title}</h2>
            <p className={styles.aboutCardDesc}>{item.description}</p>
          </div>
        ))}
      </div>
      <div className={styles.aboutFooter}>
        <span>TutorBridge</span> &copy; {new Date().getFullYear()} &mdash; All rights reserved.
      </div>
    </div>
  );
}

export default About;