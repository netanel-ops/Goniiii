# Volume Bot - RAIN & GEMS-VIP Trading Dashboard

Web-based trading dashboard with volume bot capabilities for RAIN and GEMS-VIP tokens.

## Features

- 🦊 MetaMask & WalletConnect integration
- 📊 Live price feeds (CoinGecko API)
- 🤖 Automated volume bot (Buy/Sell/Both modes)
- 🎯 Separate dashboards for RAIN & GEMS-VIP
- ⚡ Built with React + ethers.js + RainbowKit

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update token addresses in:
   - `src/DashboardRAIN.js` → `RAIN_TOKEN_ADDRESS`
   - `src/DashboardGEMS.js` → `GEMS_TOKEN_ADDRESS`

3. Run locally:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Deploy (automatic build + live URL)

## Configuration

- **Chains:** Ethereum Mainnet + Arbitrum (configurable in `WalletConnection.js`)
- **Router:** Uniswap V3 Router (update if using different DEX)
- **Price refresh:** 5 seconds (configurable in Dashboard files)

## TODO

- [ ] Add actual RAIN token address
- [ ] Add actual GEMS-VIP token address
- [ ] Verify router addresses for target chains
- [ ] Add volume stats tracking
- [ ] Add transaction history
- [ ] Add gas estimation

## Security

⚠️ This is a trading bot. Always:
- Test on testnet first
- Use small amounts initially
- Review all token addresses
- Understand gas costs
- Never share your private keys
