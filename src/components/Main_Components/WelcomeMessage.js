const WelcomeMessage = () => {
  return (
    <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 class="sm:text-4xl text-3xl mb-4 font-medium text-turquoise font-readexPro">
        Beep boop! Welcome, human friend!
        <br class="hidden lg:inline-block" />
      </h1>
      <p class="mb-8 leading-relaxed">
        I, RoboPass, am here to save the day with my incredible
        password-generating skills. Protecting your online accounts is my top
        priority, and I've made it super easy and fun!
      </p>
    </div>
  );
};

export default WelcomeMessage;
