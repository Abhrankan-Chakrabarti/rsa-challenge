export default function IntroBox() {
  return (
    <div className="intro-box intro-animate">
      <span className="intro-icon">ℹ️</span>
      <div className="intro-text">
        <strong>New here?</strong><br />
        The first <strong>23 challenges</strong> correspond to RSA numbers that were{" "}
        <em>already factored historically</em>. You only need to understand RSA
        decryption and the original RSA-129 encoding to solve one and appear on
        the leaderboard.
      </div>
    </div>
  );
}
