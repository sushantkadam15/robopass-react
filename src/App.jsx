import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#generator-heading">Skip to password generator</a>
      <div className="app-shell"><Header /><Main /><Footer /></div>
    </>
  );
}
