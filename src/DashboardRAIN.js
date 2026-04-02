import React, { useEffect, useState } from "react";
import axios from "axios";
import BotEngine from "./BotEngine";
import SwapButton from "./SwapButton";
import { useSigner } from "wagmi";

// TODO: Replace with actual RAIN token address on Arbitrum
const RAIN_TOKEN_ADDRESS = "0x...";
const UNISWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"; // Uniswap V3 Router

function DashboardRAIN() {
  const [price, setPrice] = useState(0);
  const { data: signer } = useSigner();
  const [botEngine, setBotEngine] = useState(null);

  useEffect(() => {
    if (signer) {
      setBotEngine(
        new BotEngine(signer, RAIN_TOKEN_ADDRESS, UNISWAP_ROUTER_ADDRESS)
      );
    }
  }, [signer]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=rain&vs_currencies=usd"
        );
        setPrice(res.data.rain?.usd || 0);
      } catch (err) {
        console.error("Price fetch error:", err);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!signer) return <p>Connect wallet first</p>;

  return (
    <div className="dashboard">
      <h2>RAIN Dashboard</h2>
      <div className="price-display">Live Price: ${price.toFixed(4)}</div>
      <div className="swap-controls">
        <SwapButton action="BUY" botEngine={botEngine} amount={0.01} />
        <SwapButton action="SELL" botEngine={botEngine} amount={0.01} />
      </div>
    </div>
  );
}

export default DashboardRAIN;
