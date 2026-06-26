import { STATS, FEATURES } from "../utils/Contact";
import "../Styles/contact.css"
function ContactAboutSection() {
  return (
    <section className="mlrr-about-hero">
      <div className="mlrr-about-inner">
        <div>
          <h1>
            We Help You Find Your <em>Dream Home</em> — Affordably
          </h1>
          <p>
            MLRR is India's most transparent home loan advisory...
          </p>

          <div className="mlrr-stats">
            {STATS.map((s) => (
              <div className="mlrr-stat-card" key={s.label}>
                <div className="mlrr-stat-num">{s.num}</div>
                <div className="mlrr-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mlrr-about-right">
          {FEATURES.map((f) => (
            <div className="mlrr-feature-pill" key={f.title}>
              <div className="mlrr-pill-icon">{f.icon}</div>
              <div>
                <div className="mlrr-pill-title">{f.title}</div>
                <div className="mlrr-pill-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactAboutSection;

