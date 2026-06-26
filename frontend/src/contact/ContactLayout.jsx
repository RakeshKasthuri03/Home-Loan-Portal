import ContactAboutSection from "./ContactAboutSection";
import ContactSection from "./ContactSection";
import FaqSection from "./FaqSection";
import "../styles/contact.css";

export default function ContactLayout() {
  return (
    <div className="mlrr-root">
      <ContactAboutSection />
      <div className="mlrr-divider" />
      <ContactSection />
      <div className="mlrr-divider" />
      <FaqSection />
    </div>
  );
}
