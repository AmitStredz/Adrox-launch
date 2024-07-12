import logo from "./logo.svg";
import "./App.css";
import Adrox from "./Components/Adrox";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
// import LandingPage from "./Components/LandingPage";
// import LandingPage from "./Components/Adrox";

function App() {
  useEffect(() => {
    Aos.init();
    Aos.refresh();
  }, []);

  return (
    <div className="App">
      <Adrox />
      {/* <LandingPage /> */}
      {/* <LandingPage /> */}
    </div>
  );
}

export default App;
