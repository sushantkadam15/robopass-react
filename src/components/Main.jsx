import WelcomeMessage from './Main_Components/WelcomeMessage';
import PasswordGenApp from './Main_Components/PasswordGenApp';
import About from './Main_Components/About';

export default function Main() {
  return (
    <main id="main">
      <div className="hero-layout"><WelcomeMessage /><PasswordGenApp /></div>
      <About />
    </main>
  );
}
