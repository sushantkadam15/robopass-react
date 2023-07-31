import WelcomeMessage from "./Main_Components/WelcomeMessage";
import PasswordGenApp from "./Main_Components/PasswordGenApp";
import About from "./Main_Components/About";

const Main = () => {
  return (
    <main >
      <div className="flex flex-col-reverse md:flex-row  items-center md:items-start ">
        <WelcomeMessage />
        <PasswordGenApp  />
      </div>
      <div>
        <About />
      </div>
    </main>
  );
};

export default Main;
