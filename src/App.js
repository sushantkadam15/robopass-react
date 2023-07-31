import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";



function App() {
  return (
    <div className = "flex flex-col min-h-fit justify-between w-screen min-w-fit max-w-[1500px] px-5 py-1">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
