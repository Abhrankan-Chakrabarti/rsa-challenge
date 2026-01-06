import { useEffect, useState } from "react";

// --------------------------------------------------
// API base URL (env → fallback → localhost)
// --------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface LatestSolveData {
  nickname: string;
  challenge: string;
  solved_at: string;
}

export default function LatestSolve() {
  const [latest, setLatest] = useState<LatestSolveData | null>(null);

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetch(`${API_BASE}/api/leaderboard`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.latest) {
          setLatest(data.latest);
        }
      } catch (err) {
        console.error("Failed to load latest solve", err);
      }
    }

    loadLatest();
    const interval = setInterval(loadLatest, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!latest) return null;

  return (
    <div className="latest-solve">
      🔥 <strong>Latest solve:</strong>{" "}
      {latest.nickname} solved{" "}
      <strong>{latest.challenge}</strong> on {latest.solved_at}
    </div>
  );
}
