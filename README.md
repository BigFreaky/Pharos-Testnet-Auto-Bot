
# Pharos Testnet Auto Interaction Bot

Pharos Testnet Auto Interaction Bot is a JavaScript-based automation script designed to simplify interactions with the Pharos application. It enables users to perform various tasks automatically, such as sending messages, managing wallets, and more.

## Features

- Dynamic terminal interface (TUI)** with `blessed` + `chalk`
- Direct interaction with smart contracts via `ethers.js`
- Supports HTTP and SOCKS Proxy
- Multiple wallet support via `.env`

## Prerequisites

- Node.js (v18 or higher)  
- npm or yarn  
- Pharos Testnet wallet private keys  
- *(Optional)* Proxy list in `proxies.txt`  

## Node.js Installation (WSL / Linux)

To install Node.js v18+ on WSL or Linux, run:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:

```bash
node -v
npm -v
```

## Installation

1. Make sure [Node.js](https://nodejs.org/) is installed (see above).  
2. Clone the repository:
   ```bash
   git clone https://github.com/BigFreaky/Pharos-Testnet-Auto-Bot.git
   ```
3. Navigate to the project folder:
   ```bash
   cd Pharos-Testnet-Auto-Bot
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file in the root directory and add your private keys:

   ```bash
   echo 'PRIVATE_KEY_1=' > .env
   ```

   Add the following line inside `.env`:

   ```env
   PRIVATE_KEY_1="0xabc123...,0xdef456...,0xghi789..."
   ```

   - Replace each `0xabc123...` with your actual private keys separated by commas.  
   - Keys can optionally omit the `0x` prefix, but including it is recommended.  
   - Example:
     ```
     PRIVATE_KEY_1="0x1111aaa...,0x2222bbb...,0x3333ccc..."
     ```

6. Run the bot:
   ```bash
   npm start
   ```

---

## Important Notes

- This bot is for **TESTNET** use only  
- Never use **Mainnet Private Keys**  
- The bot runs indefinitely until stopped (`Ctrl+C`)  
- All transactions use 0 gas price (testnet feature)  
- Includes random delays between operations to mimic natural behavior
- Do not share your .env with anyone!

---

## Support and Contact

For issues or questions, please open an issue on GitHub. Visit Our Telegram Channel: https://t.me/earningdropshub

---

## Disclaimer

This software is provided "as is" without warranties. Use at your own risk. Developers are not responsible for any losses or issues caused by using this bot.

---

## License

MIT License — See LICENSE file for details.
