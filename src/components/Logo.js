// Import the logo image
import LogoImg from "../components/assets/logo.png";

// Logo component to display logo image and text
const Logo = () => {
  return (
    <div className="flex items-center">
      {/* Logo image */}
      <div>
        <img src={LogoImg} alt="RoboPass Logo" className="h-12" />
      </div>
      {/* Logo text */}
      <div className="self-end">
        {/* Logo title */}
        <h1 className="font-readexPro text-xl md:text-2xl font-bold tracking-wider">
          Robo<span className="text-turquoise">Pass</span>
        </h1>
        {/* Logo tagline */}
        <div className="text-xs tracking-wide">
          Generate Strong and Secure Passwords
        </div>
      </div>
    </div>
  );
};

export default Logo;
