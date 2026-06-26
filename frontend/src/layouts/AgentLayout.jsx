import { Outlet } from "react-router-dom";
import AgentHeader from "../modules/agent/AgentHeader";

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
