import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";



function App() {
  return (
    <div className = " w-11/12 min-w-[310px] max-w-full  md:min-w-[1000px] min-h-screen flex  flex-col justify-between mx-auto px-5 ">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
