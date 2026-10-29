import robot from '../assets/robopass-about.png';

export default function WelcomeMessage() {
  return (
    <div className="welcome">
      <p className="eyebrow">BEEP BOOP. BETTER PASSWORDS AHEAD.</p>
      <h1>Small robot.<br /><span>Big possibilities.</span></h1>
      <p className="welcome-description">A fresh password for every account. Create a random password or a memorable passphrase, right here in your browser.</p>
      <div className="welcome-details">
        <img src={robot} alt="A friendly RoboPass robot with a magnifying glass" width="220" height="220" />
        <p>Your tiny helper for<br /><strong>a safer digital day.</strong></p>
      </div>
      <p className="welcome-note">No sign-up. No saved passwords. Just you and your robot.</p>
    </div>
  );
}
