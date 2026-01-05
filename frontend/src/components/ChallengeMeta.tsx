import type { ChallengeRecord } from "../types";

export default function ChallengeMeta({ record }: { record: ChallengeRecord }) {
  const bits = BigInt(record.n).toString(2).length;
  return (
    <div className="meta">
      <strong>{record.name}</strong><br />
      modulus size: {bits} bits<br />
      public exponent (e): <code>{record.e}</code><br />
      modulus (n): <code>{record.n}</code><br />
      ciphertext (c): <code>{record.c}</code>
    </div>
  );
}
