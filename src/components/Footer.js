import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <footer className=" mt-10 h-20 flex flex-col justify-around  items-center text-xs border-t py-2 md:flex-row">
      <div className="mt-2 md:mt-0">
        <a href="https://www.linkedin.com/in/sushant-p-kadam/">
          <LinkedInIcon className="mx-2" />
        </a>
        <a href="https://github.com/sushantkadam15">
          <GitHubIcon className="mx-2" />
        </a>
      </div>
      <div className=" tracking-wide">
        Created with ❤️ by{" "}
        <span className=" text-turquoise">Sushant Kadam</span>
      </div>
    </footer>
  );
};

export default Footer;
