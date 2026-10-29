import Logo from './Logo';

export default function Header() {
  return (
    <header className="site-header">
      <a href="./" className="brand" aria-label="RoboPass home"><Logo /></a>
      <a className="source-link" href="https://github.com/sushantkadam15/robopass-react">View source <span aria-hidden="true">↗</span></a>
    </header>
  );
}
