import Logo from "../components/Logo";

// Header component for displaying the website header
const Header = () => {
  return (
    // Header section
    <header className="body-font">
      {/* Container for header content */}
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* Logo with a link to the homepage */}
        <a href="https://robopass.sushantk.com" className="flex font-medium items-center mb-4 md:mb-0">
          {/* Render the Logo component */}
          <Logo />
        </a>
      </div>
    </header>
  );
};

export default Header;
