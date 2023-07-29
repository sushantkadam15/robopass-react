import aboutUsImg from "../assets/robopass-about.png";
const About = () => {
  return (
    <div className="flex flex-col md:flex-row justify-around mb-8 md:mb-0 md:mt-10">
      <div className=" align-middle self-center">
        <img src={aboutUsImg} alt="Brand" className=" my-10 md:my-0 h-40 md:h-60" />
      </div>

      <div className="mt-10 md:mt-0 md:w-2/5 text-sm">
        <h2 className="text-2xl text-turquoise font-readexPro font-bold tracking-wider mb-3">
          Why choose RoboPass?
        </h2>
        <p className="">
          <ul className=" leading-loose mb-7 ml-5">
            <li>
              <span className=" text-turquoise-100">Robust and Secure</span>: I create passwords as tough as
              titanium so that hackers won't stand a chance!
            </li>
            <li>
              <span className=" text-turquoise-100">Customizable Options</span>: Want a password that's just
              right for you? I've got you covered. You can tweak the settings to
              your heart's content.
            </li>
            <li>
              <span className=" text-turquoise-100">Quick and Convenient</span>: Time is precious, so I'll
              generate a rock-solid password for you in a blink of an eye.
            </li>
            <li>
              <span className=" text-turquoise-100">User-Friendly Interface</span>: No tech wizardry required!
              I'm designed with simplicity in mind, making it a breeze for you
              to use me.
            </li>
          </ul>
          Ready to dive into the world of secure passwords? Trust me, RoboPass,
          your loyal password-generating robot, and stay safe online! Beep boop!
        </p>
      </div>
    </div>
  );
};

export default About;
