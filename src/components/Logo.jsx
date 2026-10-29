import logo from './assets/logo.png';

export default function Logo() {
  return (
    <span className="logo">
      <img src={logo} alt="" width="48" height="48" />
      <span>Robo<span className="accent">Pass</span><small>Your friendly password generator</small></span>
    </span>
  );
}
