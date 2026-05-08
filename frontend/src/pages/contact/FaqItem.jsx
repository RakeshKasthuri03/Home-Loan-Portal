import "../../Styles/contact.css"
function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`mlrr-faq-item${isOpen ? " open" : ""}`}>
      <button className="mlrr-faq-q" onClick={onToggle}>
        {faq.q}
        <span className="mlrr-faq-chevron">▼</span>
      </button>
      <div className="mlrr-faq-a">
        <div className="mlrr-faq-a-inner">{faq.a}</div>
      </div>
    </div>
  );
}

export default FaqItem;