import { useEffect, useRef, useState } from "react";

const AnimateOnScroll = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // stop observing once shown
        }
      },
      {
        threshold: 0.15,              // trigger only when 15% visible
        rootMargin: "0px 0px -100px 0px", // delay animation slightly
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-animate ${isVisible ? "show" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;