import { useState } from "react";

// --------------------------------------------------
// API base URL (env → fallback → localhost)
// --------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  const [nickname, setNickname] = useState(
    localStorage.getItem("rsa_nickname") || ""
  );
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");

  async function sha256hex(str: string) {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(str)
    );
    return [...new Uint8Array(buf)]
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function handleSubmit() {
    const normalized = guess.trim().toUpperCase();
    const hash = await sha256hex(normalized);

    if (hash !== record.sha256.toLowerCase()) {
      setResult("✖ Incorrect guess.");
      return;
    }

    if (!nickname.trim()) {
      setResult("✖ Enter a nickname.");
      return;
    }

    localStorage.setItem("rsa_nickname", nickname);

    try {
      const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge: record.name,
          sha256: hash,
          name: nickname
        })
      });

      const reply = await res.json();
      setResult(reply.ok ? "✔ Solve recorded." : "Submission failed.");
    } catch (err) {
      console.error("Submit failed:", err);
      setResult("Submission failed.");
    }
  }

  return (
    <div>
      <input
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        placeholder="Nickname"
      />

      <input
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="Guess"
      />

      <button onClick={handleSubmit}>Check guess</button>

      <div
        className={
          result.startsWith("✔")
            ? "ok"
            : result.startsWith("✖")
            ? "bad"
            : ""
        }
      >
        {result}
      </div>
    </div>
  );
}
