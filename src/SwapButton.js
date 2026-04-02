import React, { useState } from "react";

function SwapButton({ action, botEngine, amount }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (action === "BUY") await botEngine.buyETH(amount);
      if (action === "SELL") await botEngine.sellToken(amount);
    } catch (err) {
      console.error(`${action} failed:`, err);
      alert(`${action} failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Processing..." : action}
    </button>
  );
}

export default SwapButton;
