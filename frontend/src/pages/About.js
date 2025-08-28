import React from "react";
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
  return <div className={styles.aboutPage}></div>;
}

export default About;
