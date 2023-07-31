import LogoImg from "../components/assets/logo.png";
const Logo = (props) => {
  return (
    <div className="flex items-center mt-4 ">
      <div>
        <img src={LogoImg} alt="RoboPass Logo" className="h-12 md:h-20" />
      </div>
      <div className="self-end">
        <h1 className=" font-readexPro text-xl md:text-2xl font-bold  tracking-wider">
          Robo<span className=" text-turquoise">Pass</span>
        </h1>
        <div className="text-xs tracking-wide">Generate Strong and Secure Passwords</div>
      </div>
    </div>
  );
};

export default Logo;
