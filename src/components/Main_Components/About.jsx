export default function About() {
  return (
    <section className="about" aria-labelledby="about-heading">
      <div className="about-intro">
        <p className="eyebrow">A FEW GOOD PASSWORD HABITS</p>
        <h2 id="about-heading">Give every account its own secret.</h2>
      </div>
      <div className="tips">
        <article><span className="tip-number" aria-hidden="true">01</span><h3>Keep it unique</h3><p>Generate a different password for every account so a leak at one service doesn’t expose the others.</p></article>
        <article><span className="tip-number" aria-hidden="true">02</span><h3>Let a manager remember</h3><p>Save your new password in a password manager. RoboPass doesn’t store it, and refreshing replaces it.</p></article>
        <article><span className="tip-number" aria-hidden="true">03</span><h3>Add another layer</h3><p>Turn on multi-factor authentication when available. A password is only one part of protecting an account.</p></article>
      </div>
    </section>
  );
}
