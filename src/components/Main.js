import WelcomeMessage from "./Main_Components/WelcomeMessage";
import PasswordGenApp from "./Main_Components/PasswordGenApp";
import About from "./Main_Components/About";

const Main = () => {
  return (
    <main className="h-full flex flex-col justify-evenly mt-10 md:mt-20">
      <div className="flex flex-col-reverse items-center md:flex-row md:justify-around md:mb-16">
        <WelcomeMessage />
        <PasswordGenApp />
      </div>
      <div>
      <About />
      </div>
      
    </main>
  );
};

export default Main;
