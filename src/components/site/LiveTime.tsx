import { useEffect, useState } from "react";

export function LiveTime({ className }: { className?: string }) {
  const [now, setNow] = useState<string>("—");
  useEffect(() => {
    const fmt = () =>
      setNow(
        new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST",
      );
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return <time className={className}>{now}</time>;
}
