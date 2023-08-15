import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

// Footer component to display social media links and creator information
const Footer = () => {
  return (
    <footer>
      {/* Container for the footer content */}
      <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">

        {/* Logo */}
        <a class="flex title-font font-medium items-center md:justify-start justify-center ">
          <span class="ml-3 text-l">
            Robo<span className=" text-turquoise">Pass</span>
          </span>
        </a>

        {/* Creator Information */}
        <p class="text-sm sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          Created with ❤️ by
          <span class="ml-1 text-turquoise">Sushant Kadam</span>
        </p>

        {/* Social Media Links */}
        <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          {/* LinkedIn Profile */}
          <a class="ml-3" href="https://www.linkedin.com/in/sushant-p-kadam/">
            <LinkedInIcon />
          </a>
          {/* GitHub Profile */}
          <a href="https://github.com/sushantkadam15">
            <GitHubIcon className="mx-2 w-5 h-5" />
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
