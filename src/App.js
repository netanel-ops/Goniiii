import React, { useState } from "react";
import WalletConnection from "./WalletConnection";
import DashboardRAIN from "./DashboardRAIN";
import DashboardGEMS from "./DashboardGEMS";
import "./App.css";

function App() {
  const [dashboard, setDashboard] = useState(null);

  return (
    <div className="App">
      <header>
        <h1>🐙 Volume Bot</h1>
        <WalletConnection />
      </header>
      
      <div className="token-selector">
        <h2>Select Token</h2>
        <div className="buttons">
          <button 
            className={dashboard === "RAIN" ? "active" : ""} 
            onClick={() => setDashboard("RAIN")}
          >
            RAIN
          </button>
          <button 
            className={dashboard === "GEMS" ? "active" : ""} 
            onClick={() => setDashboard("GEMS")}
          >
            GEMS-VIP
          </button>
        </div>
      </div>

      {dashboard === "RAIN" && <DashboardRAIN />}
      {dashboard === "GEMS" && <DashboardGEMS />}
    </div>
  );
}

export default App;
