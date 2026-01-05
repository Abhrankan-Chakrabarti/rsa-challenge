import { useEffect, useState } from "react";
import ChallengeSelect from "./components/ChallengeSelect";
import GuessForm from "./components/GuessForm";
import Leaderboard from "./components/Leaderboard";
import ChallengeMeta from "./components/ChallengeMeta";
import HintBox from "./components/HintBox";
import IntroBox from "./components/IntroBox";
import LatestSolve from "./components/LatestSolve";
import type { ChallengeRecord } from "./types";
import "./App.css";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [records, setRecords] = useState<ChallengeRecord[]>([]);
  const [selected, setSelected] = useState<ChallengeRecord | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("http://localhost:5000/api/challenges")
      .then(res => res.json())
      .then((data: ChallengeRecord[]) => {
        setRecords(data);
        setSelected(data[0]);
      });
  }, []);

  if (!selected) return <div>Loading challenges…</div>;

  return (
    <div className="App">
      <h1>RSA Factoring Challenge</h1>
      <ThemeToggle />
      <p>
        Each challenge encrypts a hidden plaintext using a historical RSA public key.
        Recover the plaintext. Your guess is verified using SHA-256.
      </p>
      <IntroBox />
      <ChallengeSelect records={records} onSelect={setSelected} counts={counts} />
      <ChallengeMeta record={selected} />
      <HintBox />
      <GuessForm record={selected} />
      <hr />
      <h2>🏆 Leaderboard</h2>
      <LatestSolve />
      <Leaderboard onCounts={setCounts} />
    </div>
  );
}

export default App;
