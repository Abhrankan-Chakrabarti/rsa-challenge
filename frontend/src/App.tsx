import { useEffect, useState } from "react";
import ChallengeSelect from "./components/ChallengeSelect";
import GuessForm from "./components/GuessForm";
import Leaderboard from "./components/Leaderboard";

interface ChallengeRecord {
  name: string;
  sha256: string;
  n: string;
  e: number;
  c: string;
}

function App() {
  const [records, setRecords] = useState<ChallengeRecord[]>([]);
  const [selected, setSelected] = useState<ChallengeRecord | null>(null);

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
      <ChallengeSelect records={records} onSelect={setSelected} />
      <GuessForm record={selected} />
      <Leaderboard />
    </div>
  );
}

export default App;
