import { useState } from "react";

export default function HintBox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hint-box">
      <div className="hint-toggle" onClick={() => setOpen(!open)}>
        🔰 How do I turn the decrypted number into text?
      </div>
      {open && (
        <div style={{ marginTop: "0.6rem" }}>
          <p>After solving an RSA challenge, you will obtain a <strong>decimal integer</strong>.</p>
          <p><strong>Original RSA-129 encoding:</strong></p>
          <pre>A = 01, B = 02, …, Z = 26{'\n'}Space = 00</pre>
          <p><strong>Example:</strong></p>
          <pre>0805121215002315181204</pre>
          <pre>08 05 12 12 15 00 23 15 18 12 04{'\n'}HELLO WORLD</pre>
          <p><strong>Important:</strong> If the decimal length is odd, prepend a leading zero.</p>
        </div>
      )}
    </div>
  );
}
