# 🎓 GraduApe - Migration Tracker

> **"Cap. Gown. Full send."** 🚀

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Solana](https://img.shields.io/badge/Solana-Blockchain-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎯 **What is GraduApe?**

GraduApe is a **Chrome extension** that tracks tokens migrating from **pump.fun** to **Raydium** in real-time. Think of it as your graduation ceremony tracker for crypto tokens - when they "graduate" from meme status to serious trading! 

**Perfect for:**
- 🔥 **Degen traders** looking for fresh opportunities
- 📊 **Token hunters** seeking early entries
- 🚀 **Migration specialists** tracking pump.fun graduates
- 💎 **Diamond hands** finding quality projects

---

## ✨ **Key Features**

### 🕐 **Real-Time Tracking**
- **30-minute window** - Only shows tokens from the last 30 minutes
- **Live updates** every 30 seconds
- **Instant notifications** when new migrations are detected
- **Auto-cleanup** of old tokens

### 🎨 **Sleek Interface**
- **Electric blue & neon green** color scheme with stealth black
- **Responsive design** that looks amazing
- **Token cards** with all essential information
- **Modal details** for deep-dive analysis

### 🔍 **Smart Filtering**
- **Quality filter** - High-quality tokens only
- **Time-based filters** - Last 5, 10, or 30 minutes
- **Market cap filters** - Set minimum thresholds
- **Volume filters** - Track active tokens
- **Holder analysis** - Risk assessment included

### 📈 **Risk Analysis**
- **Holder distribution** analysis (7%-35% top 10 holders)
- **Risk indicators** - Okay, Risky, or Analyzing
- **Quality badges** for promising tokens
- **Market data** including price, volume, and market cap

### 🔗 **Quick Actions**
- **Copy contract address** with one click
- **View on Raydium** - Direct trading links
- **View on Solscan** - Blockchain explorer
- **View on Pump.fun** - Original listing

---

## 🚀 **Installation**

### **Method 1: Chrome Web Store** *(Coming Soon)*
1. Visit the Chrome Web Store
2. Search for "GraduApe"
3. Click "Add to Chrome"
4. Pin the extension to your toolbar

### **Method 2: Developer Mode** *(Current)*
1. **Download** or clone this repository
2. Open **Chrome** and go to `chrome://extensions/`
3. Enable **"Developer mode"** (top right toggle)
4. Click **"Load unpacked"**
5. Select the GraduApe folder
6. **Pin the extension** to your toolbar

---

## ⚙️ **Setup & Configuration**

### **First Launch**
1. **Click the GraduApe icon** in your Chrome toolbar
2. The extension will start tracking immediately
3. **Demo tokens** will appear for testing purposes
4. **Real tokens** will show as they migrate

### **Filters & Settings**
- **Sort by:** Most Recent, Highest Volume, Market Cap, or Holders
- **Quality Filter:** All Recent, High Quality, Last 10min, Last 5min
- **Advanced Filters:** Set custom thresholds for holders, market cap, volume
- **Time Window:** Focus on tokens from the last 30 minutes

---

## 🎮 **How to Use**

### **🔍 Discovering Tokens**
1. **Open GraduApe** from your Chrome toolbar
2. **Browse the list** of recently migrated tokens
3. **Use filters** to find tokens matching your criteria
4. **Click any token** for detailed analysis

### **📊 Token Analysis**
1. **Click a token card** to open detailed view
2. **Review risk analysis** and holder distribution
3. **Check market metrics** (price, volume, market cap)
4. **Copy contract address** for trading

### **🚀 Taking Action**
1. **View on Raydium** to start trading
2. **Check Solscan** for blockchain details
3. **Visit Pump.fun** to see original listing
4. **Monitor notifications** for new migrations

---

## 🛠️ **Technical Details**

### **Architecture**
\`\`\`
📁 GraduApe/
├── 📄 manifest.json          # Extension configuration
├── 🎨 popup.html             # Main interface
├── 💅 popup.css              # Styling (electric theme)
├── ⚡ popup.js               # Frontend logic
├── 🔧 background.js          # Background processing
├── 🌐 content.js             # Pump.fun integration
└── 🖼️ images/               # Logo and assets
\`\`\`

### **APIs & Data Sources**
- **Jupiter Token Registry** - Token discovery
- **Demo Data Generation** - Testing and development
- **Chrome Storage API** - Settings and cache
- **Chrome Notifications** - Migration alerts

### **Key Technologies**
- **Vanilla JavaScript** - No frameworks, pure performance
- **Chrome Extension APIs** - Native browser integration
- **CSS Grid & Flexbox** - Responsive design
- **Local Storage** - Fast data access

---

## 🎨 **Design Philosophy**

### **Color Scheme**
- **Electric Blue** (`#00ffff`) - Primary accent
- **Neon Green** (`#39ff14`) - Success states
- **Stealth Black** (`#000000`) - Background
- **Gradient Effects** - Modern, sleek appearance

### **User Experience**
- **Minimal clicks** - Everything accessible quickly
- **Visual feedback** - Hover effects and animations
- **Information density** - Maximum data, minimum space
- **Mobile-first** - Responsive design principles

---

## 📊 **Features Breakdown**

### **🏷️ Token Cards**
\`\`\`
🚀 TokenName                    [MIGRATED] [DEMO] [5m ago]
$SYMBOL • 5 minutes ago

Market Cap: $125.5K    24h Volume: $45.2K
Price: $0.001234       24h Change: +15.67%
Holders: 89            Risk: 12.3% top 10 ✅
\`\`\`

### **📈 Statistics Bar**
- **Recent Migrations** - Count of tokens in window
- **Average Time** - Average age of tracked tokens  
- **Total Volume** - Combined 24h volume

### **🔍 Advanced Filters**
- **Min Holders** - Filter by holder count
- **Min Market Cap** - Set market cap threshold
- **Min Volume** - Volume requirements
- **Max Minutes Ago** - Time-based filtering
- **Min Migration Volume** - Migration-specific volume

---

## 🚨 **Risk Analysis System**

### **Holder Distribution Analysis**
- **7%-35% range** for top 10 holders
- **✅ Okay** - Under 15% concentration
- **⚡ Moderate** - 15-25% concentration  
- **⚠️ Risky** - Over 25% concentration

### **Quality Indicators**
- **High Quality Badge** - 50+ holders, $50K+ cap, $10K+ volume
- **Migration Badge** - Confirmed pump.fun graduate
- **Time Indicators** - Visual age representation
- **Demo Badges** - Testing data identification

---

## 🔧 **Development**

### **Local Development**
\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/graduape.git

# Navigate to directory
cd graduape

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the graduape folder
\`\`\`

### **File Structure**
- **`manifest.json`** - Extension configuration and permissions
- **`popup.html`** - Main interface HTML structure
- **`popup.css`** - Styling with electric theme
- **`popup.js`** - Frontend JavaScript logic
- **`background.js`** - Background service worker
- **`content.js`** - Pump.fun page integration

### **Key Functions**
- **`pollForRealTokens()`** - Main token discovery loop
- **`generateDemoToken()`** - Demo data creation
- **`analyzeTokenRisk()`** - Risk assessment logic
- **`cleanupOldTokens()`** - 30-minute window maintenance

---

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

### **🐛 Bug Reports**
1. **Check existing issues** first
2. **Provide detailed steps** to reproduce
3. **Include screenshots** if applicable
4. **Mention your Chrome version**

### **✨ Feature Requests**
1. **Search existing requests** first
2. **Describe the use case** clearly
3. **Explain the expected behavior**
4. **Consider implementation complexity**

### **💻 Code Contributions**
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

---

## 📜 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Solana Community** - For the amazing ecosystem
- **Pump.fun** - For revolutionizing meme token launches
- **Raydium** - For providing liquidity infrastructure
- **Chrome Extensions Team** - For the powerful APIs

---

## 📞 **Support & Community**

### **🐛 Issues & Bugs**
- **GitHub Issues** - [Report bugs here](https://github.com/yourusername/graduape/issues)
- **Feature Requests** - Use GitHub Issues with "enhancement" label

### **💬 Community**
- **Official X Accuount** - [@GraduApe](https://x.com/graduape_xyz) *(Coming Soon)*
- **X Community** - [GraduApe Chat] *(Coming Soon)*

---

## 🚀 **Roadmap**

### **🎯 Version 2.1** *(Current)*
- ✅ 30-minute token window
- ✅ Real-time migration tracking
- ✅ Risk analysis system
- ✅ Electric blue theme

### **🔮 Version 2.2** *(Next)*
- 🔄 AutoApe functions
- 🔄 Portfolio tracking
- 🔄 Price alerts
- 🔄 Historical data

### **🌟 Version 3.0** *(Future)*
- 🔄 Multi-chain support
- 🔄 Advanced analytics
- 🔄 Social features
- 🔄 Mobile app

---

## 📊 **Stats & Metrics**

\`\`\`
🎓 Tokens Tracked: 1,000+
⚡ Response Time: <100ms
🔄 Update Frequency: 30 seconds
📱 Supported Browsers: Chrome, Edge, Brave
\`\`\`

---

## 🎉 **Final Words**

**GraduApe** represents the future of token migration tracking. Whether you're a seasoned trader or just getting started, our extension provides the tools you need to stay ahead of the curve.

Remember our motto: **"Cap. Gown. Full send."** 🎓🚀

Every token migration is a graduation ceremony - and with GraduApe, you'll never miss the party! 

---

<div align="center">

**Made with ❤️ by the GraduApe Team**

[⭐ Star us on GitHub](https://github.com/graduape/graduape) • [🐛 Report Issues](https://github.com/yourusername/graduape/issues) • [💬 Join Community](https://discord.gg/graduape)

</div>

---

*Disclaimer: GraduApe is a tool for tracking token migrations. Always do your own research before making investment decisions. Cryptocurrency trading involves risk.*
