import { useState } from "react";

// Define the shape of a challenge record
interface ChallengeRecord {
  name: string;
  sha256: string;
  n: string;
  e: number;
  c: string;
}

interface GuessFormProps {
  record: ChallengeRecord;
}

export default function GuessForm({ record }: GuessFormProps) {
  const [nickname, setNickname] = useState(localStorage.getItem("rsa_nickname") || "");
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");

  async function sha256hex(str: string) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function handleSubmit() {
    const hash = await sha256hex(guess.trim().toUpperCase());
    if (hash !== record.sha256.toLowerCase()) {
      setResult("✖ Incorrect guess.");
      return;
    }
    localStorage.setItem("rsa_nickname", nickname);
    const res = await fetch("http://localhost:5000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge: record.name, sha256: hash, name: nickname })
    });
    const reply = await res.json();
    setResult(reply.ok ? "✔ Solve recorded." : "Submission failed.");
  }

  return (
    <div>
      <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Nickname" />
      <input value={guess} onChange={e => setGuess(e.target.value)} placeholder="Guess" />
      <button onClick={handleSubmit}>Check guess</button>
      <div>{result}</div>
    </div>
  );
}
