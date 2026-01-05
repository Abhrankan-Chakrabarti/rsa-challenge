import type { ChallengeRecord } from "../types";

interface Props {
  records: ChallengeRecord[];
  onSelect: (rec: ChallengeRecord) => void;
  counts?: Record<string, number>; // challenge name → solve count
}

export default function ChallengeSelect({ records, onSelect, counts }: Props) {
  return (
    <div>
      <label htmlFor="challenge-select">Choose challenge</label>
      <select
        id="challenge-select"
        onChange={(e) => {
          const rec = records[parseInt(e.target.value, 10)];
          onSelect(rec);
        }}
      >
        {records.map((rec, i) => {
          const bits = BigInt(rec.n).toString(2).length;
          const count = counts?.[rec.name] ?? 0;
          return (
            <option key={rec.name} value={i}>
              {rec.name} — {bits} bits — {count} {count === 1 ? "solve" : "solves"}
            </option>
          );
        })}
      </select>
    </div>
  );
}
