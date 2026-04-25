import { useEffect, useState } from "react";

const CountUpNumber = ({ end, duration = 2000, suffix = "", start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return; // ✅ DO NOTHING until visible

    let current = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default CountUpNumber;