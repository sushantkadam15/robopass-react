import aboutUsImg from "../assets/robopass-about.png";

// About component to display information about RoboPass
const About = () => {
  return (
    // Container for the about section
    <div class="container py-24 mx-auto flex flex-wrap  ">
      {/* Left section with the robot image */}
      <div class="lg:w-1/2 sm:w-1/3 w-full mt-6 sm:mt-0 flex justify-center items-center">
        <img
          class="object-cover object-center h-60 md:h-3/6 mb-12 md:mb-0"
          src={aboutUsImg}
          alt="RoboPass Robot"
        />
      </div>

      {/* Right section with text content */}
      <div class="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
        <div class="w-full sm:p-4 px-4 mb-6">
          {/* Main heading */}
          <h2 class="mb-2 text-turquoise font-readexPro text-2xl font-bold ">
            Why choose RoboPass?
          </h2>
          <div class="leading-relaxed">
            <p className="">
              {/* List of benefits */}
              <ul className=" leading-loose mb-7 ml-5">
                <li>
                  <span className=" text-turquoise-100">Robust and Secure</span>
                  : I create passwords as tough as titanium so that hackers
                  won't stand a chance!
                </li>
                <li>
                  <span className=" text-turquoise-100">
                    Customizable Options
                  </span>
                  : Want a password that's just right for you? I've got you
                  covered. You can tweak the settings to your heart's content.
                </li>
                <li>
                  <span className=" text-turquoise-100">
                    Quick and Convenient
                  </span>
                  : Time is precious, so I'll generate a rock-solid password for
                  you in a blink of an eye.
                </li>
                <li>
                  <span className=" text-turquoise-100">
                    User-Friendly Interface
                  </span>
                  : No tech wizardry required! I'm designed with simplicity in
                  mind, making it a breeze for you to use me.
                </li>
              </ul>
              Ready to dive into the world of secure passwords? Trust me,
              RoboPass, your loyal password-generating robot, and stay safe
              online! Beep boop!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
