import { Outlet } from "react-router-dom";
import AgentHeader from "../pages/Agent/AgentHeader";


const AgentLayout = () => {
  return (
    <>
      <AgentHeader />
      <main>
        <Outlet />
      </main>
     
    </>
  );
};

export default AgentLayout;