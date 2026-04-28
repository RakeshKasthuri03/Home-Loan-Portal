import { BrowserRouter } from "react-router-dom";
import Footer from "./Components/Footer";
import UserDashboard from "./Components/userDashboard/UserDashboard";

function App() {
  return (
    <BrowserRouter>
    
      <UserDashboard />
      <Footer />
    </BrowserRouter>
  );
}

export default App;