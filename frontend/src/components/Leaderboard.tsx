import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  nickname: string;
  solves: number;
  last_solve: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  counts: Record<string, number>;
}

export default function Leaderboard({ onCounts }: { onCounts: (c: Record<string, number>) => void }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaderboard() {
    try {
      const res = await fetch("http://localhost:5000/api/leaderboard", { cache: "no-store" });
      const data: LeaderboardData = await res.json();
      setEntries(data.leaderboard || []);
      if (data.counts) onCounts(data.counts);
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Nickname</th>
          <th>Solves</th>
          <th>Last Solve</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
              Loading leaderboard…
            </td>
          </tr>
        ) : entries.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
              No solves yet.
            </td>
          </tr>
        ) : (
          entries.map((e) => (
            <tr key={e.rank}>
              <td>{e.rank}</td>
              <td>{e.nickname}</td>
              <td>{e.solves} {e.solves === 1 ? "solve" : "solves"}</td>
              <td>{e.last_solve}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
