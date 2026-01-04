import React, { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  nickname: string;
  solves: number;
  last_solve: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then(res => res.json())
      .then(data => setEntries(data.leaderboard || []));
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
        {entries.map(e => (
          <tr key={e.rank}>
            <td>{e.rank}</td>
            <td>{e.nickname}</td>
            <td>{e.solves}</td>
            <td>{e.last_solve}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
