import { useState } from "react";
import { FAQ_DATA } from "../../utils/Contact";
import FaqItem from "./FaqItem";
import "../../Styles/contact.css"
function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="mlrr-faq-section">
      <div className="mlrr-faq-bg-text">FAQ</div>
      <div className="mlrr-faq-inner">
        <div className="mlrr-section-header">
          <span className="mlrr-section-tag">❓ Quick Answers</span>
          <h2>Frequently Asked Questions</h2>
          <p>Can't find your answer here? Our team is just one call away.</p>
        </div>
        <div className="mlrr-faq-list">
          {FAQ_DATA.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;