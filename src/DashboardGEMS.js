import React, { useEffect, useState } from "react";
import axios from "axios";

// GEMS-VIP token address
const GEMS_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

function DashboardGEMS() {
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0.01);
  const [cycles, setCycles] = useState(10);
  const [delay, setDelay] = useState(60);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=gems-vip&vs_currencies=usd"
        );
        setPrice(res.data['gems-vip']?.usd || 0);
      } catch (err) {
        console.error("Price fetch error:", err);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h2>GEMS-VIP Token Dashboard</h2>
      <div className="stats">
        <p>💵 Price: ${price.toFixed(6)}</p>
        <p>📍 Address: {GEMS_TOKEN_ADDRESS.substring(0, 10)}...</p>
      </div>
      
      <div className="controls">
        <h3>Bot Controls</h3>
        <label>
          Amount (ETH): <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>
          Cycles: <input type="number" value={cycles} onChange={(e) => setCycles(e.target.value)} />
        </label>
        <label>
          Delay (seconds): <input type="number" value={delay} onChange={(e) => setDelay(e.target.value)} />
        </label>
        
        <div className="actions">
          <button className="buy">Buy</button>
          <button className="sell">Sell</button>
          <button className="both">Buy + Sell Loop</button>
        </div>
        
        <p style={{marginTop: "20px", color: "#666"}}>
          Connect wallet to enable trading
        </p>
      </div>
    </div>
  );
}

export default DashboardGEMS;
