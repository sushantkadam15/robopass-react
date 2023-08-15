// Import necessary components
import WelcomeMessage from "./Main_Components/WelcomeMessage";
import PasswordGenApp from "./Main_Components/PasswordGenApp";
import About from "./Main_Components/About";

// Main component for rendering different sections
const Main = () => {
  return (
    <main>
      {/* Section: Welcome and Password Generator */}
      <section>
        <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col-reverse items-center">
          {/* WelcomeMessage component */}
          <WelcomeMessage />
          {/* PasswordGenApp component */}
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <PasswordGenApp />
          </div>
        </div>
      </section>

      {/* Section: About */}
      <section>
        <About />
      </section>
    </main>
  );
};

export default Main;
