import { useEffect, useRef, useState } from "react";

export default function AnimateOnScroll({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () =>
 observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`${className} ${visible ? "show" : ""}`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease, transform 0.6s ease", transform: visible ? "translateY(0)" : "translateY(20px)" }}
    >
      {children}
    </div>
  );
}
