import { useEffect, useState } from "react";
import ChallengeSelect from "./components/ChallengeSelect";
import GuessForm from "./components/GuessForm";
import Leaderboard from "./components/Leaderboard";
import records from "./rsa_all_ciphertexts_hashed.json";

function App() {
  const [selected, setSelected] = useState(records[0]);

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
