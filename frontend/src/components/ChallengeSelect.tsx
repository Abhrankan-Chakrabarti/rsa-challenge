import React from "react";

interface ChallengeRecord {
  name: string;
  sha256: string;
  n: string;
  e: number;
  c: string;
}

interface Props {
  records: ChallengeRecord[];
  onSelect: (rec: ChallengeRecord) => void;
}

export default function ChallengeSelect({ records, onSelect }: Props) {
  return (
    <select onChange={e => onSelect(records[Number(e.target.value)])}>
      {records.map((rec, i) => (
        <option key={rec.name} value={i}>
          {rec.name}
        </option>
      ))}
    </select>
  );
}
