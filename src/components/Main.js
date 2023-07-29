import WelcomeMessage from "./Main_Components/WelcomeMessage";
import PasswordGenerator from "./Main_Components/PasswordGenerator";
import About from "./Main_Components/About";

const Main = () => {
  return (
    <main>
      <h1>This is main</h1>
      <WelcomeMessage />
      <PasswordGenerator />
      <About />
    </main>
  );
};

export default Main;
