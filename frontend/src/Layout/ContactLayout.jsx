import AboutSection from "../pages/contact/ContactAboutSection";
import ContactSection from "../pages/contact/ContactSection";
import FaqSection from "../pages/contact/FaqSection";
import "../Styles/contact.css"
export default function ContactLayout() {
  return (
    <div className="mlrr-root">
      <AboutSection />
      <div className="mlrr-divider" />
      <ContactSection />
      <div className="mlrr-divider" />
      <FaqSection />
    </div>
  );
}