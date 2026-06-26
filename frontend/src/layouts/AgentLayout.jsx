import { Outlet } from "react-router-dom";
import AgentHeader from "../modules/agent/AgentHeader";

const AgentLayout = () => {
  return (
    <>
      <AgentHeader />
      <main style={{ minWidth: 0, overflowX: "hidden" }}>
        <Outlet />
      </main>
    </>
  );
};

export default AgentLayout;
