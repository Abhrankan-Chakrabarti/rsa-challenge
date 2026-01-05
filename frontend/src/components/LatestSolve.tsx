import { useEffect, useState } from "react";

interface LatestSolveData {
  nickname: string;
  challenge: string;
  solved_at: string;
}

export default function LatestSolve() {
  const [latest, setLatest] = useState<LatestSolveData | null>(null);

  useEffect(() => {
    async function loadLatest() {
      const res = await fetch("http://localhost:5000/api/leaderboard", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.latest) setLatest(data.latest);
    }
    loadLatest();
    const interval = setInterval(loadLatest, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!latest) return null;

  return (
    <div className="latest-solve">
      🔥 <strong>Latest solve:</strong>{" "}
      {latest.nickname} solved <strong>{latest.challenge}</strong> on {latest.solved_at}
    </div>
  );
}
