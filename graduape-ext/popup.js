class GraduApePopup {
  constructor() {
    this.tokens = []
    this.filteredTokens = []
    this.isConnected = false
    this.currentToken = null
    this.needsApiKey = false
    this.init()
  }

  async init() {
    this.setupEventListeners()
    this.loadTokensFromBackground()
    this.setupMessageListener()
  }

  setupEventListeners() {
    const safeAddEventListener = (id, event, handler) => {
      const element = document.getElementById(id)
      if (element) {
        element.addEventListener(event, handler)
      } else {
        console.warn(`Element with id '${id}' not found`)
      }
    }

    safeAddEventListener("refreshBtn", "click", () => {
      this.reconnectApi()
    })

    safeAddEventListener("settingsBtn", "click", () => {
      this.showSettings()
    })

    safeAddEventListener("retryBtn", "click", () => {
      this.reconnectApi()
    })

    safeAddEventListener("sortFilter", "change", (e) => {
      this.sortTokens(e.target.value)
    })

    safeAddEventListener("qualityFilter", "change", (e) => {
      this.applyQualityFilter(e.target.value)
    })

    // Advanced filter listeners
    safeAddEventListener("minHolders", "input", () => {
      this.applyCurrentFilters()
    })

    safeAddEventListener("minMarketCap", "input", () => {
      this.applyCurrentFilters()
    })

    safeAddEventListener("minVolume", "input", () => {
      this.applyCurrentFilters()
    })

    safeAddEventListener("maxMinutesAgo", "input", () => {
      this.applyCurrentFilters()
    })

    safeAddEventListener("minMigrationVolume", "input", () => {
      this.applyCurrentFilters()
    })

    safeAddEventListener("toggleAdvanced", "click", () => {
      this.toggleAdvancedFilters()
    })

    // Modal event listeners
    safeAddEventListener("closeModal", "click", () => {
      this.closeTokenDetail()
    })

    safeAddEventListener("copyAddressBtn", "click", () => {
      this.copyContractAddress()
    })

    safeAddEventListener("viewOnPumpBtn", "click", () => {
      this.viewOnPump()
    })

    safeAddEventListener("viewOnSolscanBtn", "click", () => {
      this.viewOnSolscan()
    })

    safeAddEventListener("viewOnRaydiumBtn", "click", () => {
      this.viewOnRaydium()
    })

    // Close modal when clicking outside
    const modal = document.getElementById("tokenDetailModal")
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target.id === "tokenDetailModal") {
          this.closeTokenDetail()
        }
      })
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message) => {
      console.log("Popup received message:", message)

      switch (message.type) {
        case "connected":
          this.updateConnectionStatus(true)
          break
        case "disconnected":
          this.updateConnectionStatus(false)
          break
        case "needApiKey":
          this.showApiKeySetup()
          break
        case "apiKeyError":
          this.showApiKeyError()
          break
        case "migratedToken":
          console.log("Adding migrated token:", message.token)
          this.addMigratedToken(message.token)
          break
        case "tokenUpdate":
          this.updateToken(message.token)
          break
        case "cleanup":
          this.handleCleanup()
          break
      }
    })
  }

  async loadTokensFromBackground() {
    this.showLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({ action: "getTokens" })
      this.tokens = response.tokens || []
      this.isConnected = response.connected
      this.updateConnectionStatus(this.isConnected)
      this.applyCurrentFilters()
      this.updateStats()
    } catch (error) {
      console.error("Failed to load tokens from background:", error)
      this.showError()
    } finally {
      this.showLoading(false)
    }
  }

  showApiKeySetup() {
    this.needsApiKey = true
    this.hideError()
    this.showLoading(false)

    const tokenList = document.getElementById("tokenList")
    tokenList.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #888;">
        <h3 style="color: #00ff88; margin-bottom: 16px;">🔑 API Key Required</h3>
        <p style="margin-bottom: 16px;">GraduApe needs a Moralis API key to track token migrations.</p>
        <p style="margin-bottom: 16px; font-size: 12px;">
          1. Go to <a href="https://moralis.io" target="_blank" style="color: #00ff88;">moralis.io</a><br>
          2. Create a free account<br>
          3. Get your API key from the dashboard<br>
          4. Paste it below
        </p>
        <input type="text" id="apiKeyInput" placeholder="Enter your Moralis API key" 
               style="width: 100%; padding: 8px; margin-bottom: 12px; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px;">
        <button id="saveApiKeyBtn" style="background: #00ff88; color: #000; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
          Save API Key
        </button>
      </div>
    `

    // Re-add event listener for the new button
    document.getElementById("saveApiKeyBtn").addEventListener("click", () => {
      this.saveApiKey()
    })
  }

  showApiKeyError() {
    this.showError("API key issue detected. Extension will continue with demo data.")
  }

  async saveApiKey() {
    const apiKeyInput = document.getElementById("apiKeyInput")
    const apiKey = apiKeyInput.value.trim()

    if (!apiKey) {
      alert("Please enter a valid API key")
      return
    }

    try {
      await chrome.runtime.sendMessage({ action: "setApiKey", apiKey })
      this.needsApiKey = false
      this.showLoading(true)

      // Wait a moment for the background script to start polling
      setTimeout(() => {
        this.loadTokensFromBackground()
      }, 2000)
    } catch (error) {
      console.error("Failed to save API key:", error)
      alert("Failed to save API key. Please try again.")
    }
  }

  addMigratedToken(token) {
    console.log("Adding migrated token to popup:", token)

    this.tokens.unshift(token)

    if (this.tokens.length > 100) {
      this.tokens = this.tokens.slice(0, 100)
    }

    this.applyCurrentFilters()
    this.updateStats()

    setTimeout(() => {
      const firstToken = document.querySelector(".token-item")
      if (firstToken) {
        firstToken.style.animation = "flash 1s ease-in-out"
      }
    }, 100)
  }

  updateToken(token) {
    const index = this.tokens.findIndex((t) => t.id === token.id)
    if (index !== -1) {
      this.tokens[index] = token
      this.applyCurrentFilters()
      this.updateStats()

      if (this.currentToken && this.currentToken.id === token.id) {
        this.currentToken = token
        this.updateModalData()
        this.loadHolderData(token)
      }
    }
  }

  async reconnectApi() {
    try {
      await chrome.runtime.sendMessage({ action: "reconnect" })
      this.loadTokensFromBackground()
    } catch (error) {
      console.error("Failed to reconnect:", error)
    }
  }

  updateConnectionStatus(connected) {
    this.isConnected = connected
    const refreshBtn = document.getElementById("refreshBtn")

    if (connected) {
      refreshBtn.textContent = "🟢"
      refreshBtn.title = "Connected to Moralis API"
      refreshBtn.style.color = "#00ff88"
      this.hideError()
      console.log("Moralis API connected, tokens received:", this.tokens.length)
    } else {
      refreshBtn.textContent = "🔴"
      refreshBtn.title = "Disconnected - Click to reconnect"
      refreshBtn.style.color = "#ff4444"
      if (!this.needsApiKey) {
        this.showError("API disconnected. Click refresh to reconnect.")
      }
    }
  }

  applyQualityFilter(filterType) {
    const safeSetValue = (id, value) => {
      const element = document.getElementById(id)
      if (element) {
        element.value = value
      }
    }

    if (filterType === "quality") {
      safeSetValue("minHolders", 50)
      safeSetValue("minMarketCap", 50000)
      safeSetValue("minVolume", 10000)
    } else if (filterType === "last10") {
      safeSetValue("maxMinutesAgo", 10)
      safeSetValue("minHolders", "")
      safeSetValue("minMarketCap", "")
      safeSetValue("minVolume", "")
    } else if (filterType === "last5") {
      safeSetValue("maxMinutesAgo", 5)
      safeSetValue("minHolders", "")
      safeSetValue("minMarketCap", "")
      safeSetValue("minVolume", "")
    } else if (filterType === "all") {
      safeSetValue("minHolders", "")
      safeSetValue("minMarketCap", "")
      safeSetValue("minVolume", "")
      safeSetValue("maxMinutesAgo", "")
      safeSetValue("minMigrationVolume", "")
    }

    this.applyCurrentFilters()
  }

  toggleAdvancedFilters() {
    const advancedFilters = document.getElementById("advancedFilters")
    const toggleBtn = document.getElementById("toggleAdvanced")

    if (advancedFilters.style.display === "none") {
      advancedFilters.style.display = "block"
      toggleBtn.textContent = "Hide Advanced"
      toggleBtn.classList.add("active")
    } else {
      advancedFilters.style.display = "none"
      toggleBtn.textContent = "Advanced Filters"
      toggleBtn.classList.remove("active")
    }
  }

  applyCurrentFilters() {
    const safeGetValue = (id, defaultValue = 0) => {
      const element = document.getElementById(id)
      return element ? element.value || defaultValue : defaultValue
    }

    const sortValue = safeGetValue("sortFilter", "newest")
    const minHolders = Number.parseInt(safeGetValue("minHolders", 0)) || 0
    const minMarketCap = Number.parseFloat(safeGetValue("minMarketCap", 0)) || 0
    const minVolume = Number.parseFloat(safeGetValue("minVolume", 0)) || 0
    const maxMinutesAgo = Number.parseInt(safeGetValue("maxMinutesAgo", 0)) || 0
    const minMigrationVolume = Number.parseFloat(safeGetValue("minMigrationVolume", 0)) || 0

    this.filteredTokens = this.tokens.filter((token) => {
      const minutesAgo = (Date.now() - token.migratedAt) / (1000 * 60)

      return (
        token.holders >= minHolders &&
        token.marketCap >= minMarketCap &&
        token.volume24h >= minVolume &&
        (maxMinutesAgo === 0 || minutesAgo <= maxMinutesAgo) &&
        (token.migrationVolume || 0) >= minMigrationVolume
      )
    })

    this.sortFilteredTokens(sortValue)
    this.renderTokens()
    this.updateFilterStats()
  }

  updateFilterStats() {
    let statsElement = document.getElementById("filterStats")
    if (!statsElement) {
      statsElement = document.createElement("div")
      statsElement.id = "filterStats"
      statsElement.className = "filter-stats"
      document.querySelector(".filters").insertAdjacentElement("afterend", statsElement)
    }

    const totalTokens = this.tokens.length
    const filteredCount = this.filteredTokens.length
    const qualityCount = this.tokens.filter(
      (token) => token.holders >= 10 && token.marketCap >= 8000 && token.volume24h >= 2000,
    ).length
    const riskyCount = this.filteredTokens.filter((token) => token.riskAnalysis?.level === "risky").length
    const okayCount = this.filteredTokens.filter((token) => token.riskAnalysis?.level === "okay").length
    const analyzingCount = this.filteredTokens.filter((token) => token.riskAnalysis?.level === "analyzing").length

    statsElement.innerHTML = `
      <span>Total: ${totalTokens} | Filtered: <span class="filter-count">${filteredCount}</span> | Quality: <span class="filter-count">${qualityCount}</span></span>
      <span>Risk: <span class="risk-okay">${okayCount} Okay</span> | <span class="risk-risky">${riskyCount} Risky</span> | <span class="risk-analyzing">${analyzingCount} Analyzing</span></span>
    `
  }

  sortTokens(sortBy) {
    this.sortFilteredTokens(sortBy)
    this.renderTokens()
  }

  sortFilteredTokens(sortBy) {
    switch (sortBy) {
      case "newest":
        this.filteredTokens.sort((a, b) => b.migratedAt - a.migratedAt)
        break
      case "volume":
        this.filteredTokens.sort((a, b) => b.volume24h - a.volume24h)
        break
      case "marketcap":
        this.filteredTokens.sort((a, b) => b.marketCap - a.marketCap)
        break
      case "holders":
        this.filteredTokens.sort((a, b) => b.holders - a.holders)
        break
    }
  }

  renderTokens() {
    const tokenList = document.getElementById("tokenList")
    tokenList.innerHTML = ""

    if (this.filteredTokens.length === 0) {
      tokenList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #888;">
          ${this.tokens.length === 0 ? "Waiting for new migrations..." : "No tokens match your filters"}
          <br><br>
          <small>🔄 Polling Moralis API every 30 seconds</small>
          <br>
          <small>📊 Demo data included for testing</small>
        </div>
      `
      return
    }

    this.filteredTokens.forEach((token) => {
      const tokenElement = this.createTokenElement(token)
      tokenList.appendChild(tokenElement)
    })
  }

  createTokenElement(token) {
    const div = document.createElement("div")
    const minutesAgo = Math.floor((Date.now() - token.migratedAt) / (1000 * 60))

    let tokenClass = "token-item migrated-token recent-migration"
    if (minutesAgo <= 2) {
      tokenClass += " very-recent"
    }

    div.className = tokenClass
    div.onclick = () => this.showTokenDetail(token)

    const timeAgo = this.getTimeAgo(token.migratedAt)
    const priceChangeClass = token.priceChange24h >= 0 ? "positive" : "negative"

    const isQuality = token.holders >= 50 && token.marketCap >= 50000 && token.volume24h >= 10000
    const qualityBadge = isQuality ? '<span class="quality-badge">HIGH QUALITY</span>' : ""
    const migrationBadge = '<span class="migration-badge">MIGRATED</span>'

    const timeIndicator =
      minutesAgo <= 5 ? `<span class="time-indicator ${minutesAgo <= 2 ? "very-recent" : ""}">${timeAgo}</span>` : ""

    const riskAnalysis = token.riskAnalysis || { level: "unknown", percentage: "N/A", reason: "No data" }
    const riskBadge = `<span class="risk-badge risk-${riskAnalysis.level}">${riskAnalysis.level.toUpperCase()}</span>`

    // Add demo indicator for demo tokens
    const demoIndicator = token.id.includes("DemoToken") ? '<span class="demo-badge">DEMO</span>' : ""

    div.innerHTML = `
      <div class="token-header">
        <div class="token-image">🚀</div>
        <div>
          <div class="token-name">${token.name}${migrationBadge}${demoIndicator}${timeIndicator}${qualityBadge}${riskBadge}</div>
          <div class="token-symbol">$${token.symbol} • ${timeAgo}</div>
        </div>
      </div>
      <div class="token-stats">
        <div class="token-stat">
          <span class="token-stat-label">Market Cap</span>
          <span class="token-stat-value">$${this.formatNumber(token.marketCap)}</span>
        </div>
        <div class="token-stat">
          <span class="token-stat-label">24h Volume</span>
          <span class="token-stat-value">$${this.formatNumber(token.volume24h)}</span>
        </div>
        <div class="token-stat">
          <span class="token-stat-label">Price</span>
          <span class="token-stat-value">$${token.price.toFixed(6)}</span>
        </div>
        <div class="token-stat">
          <span class="token-stat-label">24h Change</span>
          <span class="token-stat-value ${priceChangeClass}">${token.priceChange24h.toFixed(2)}%</span>
        </div>
        <div class="token-stat">
          <span class="token-stat-label">Holders</span>
          <span class="token-stat-value">${token.holders}</span>
        </div>
        <div class="token-stat">
          <span class="token-stat-label">Risk</span>
          <span class="token-stat-value risk-${riskAnalysis.level}">${riskAnalysis.percentage}% top 10</span>
        </div>
      </div>
    `

    return div
  }

  showTokenDetail(token) {
    this.currentToken = token
    const modal = document.getElementById("tokenDetailModal")

    document.getElementById("modalTokenName").textContent = token.name
    document.getElementById("modalTokenSymbol").textContent = `$${token.symbol}`
    document.getElementById("modalTokenImage").textContent = this.getTokenEmoji(token.name)

    this.updateModalData()
    this.loadHolderData(token)

    modal.style.display = "flex"
  }

  updateModalData() {
    const token = this.currentToken
    if (!token) return

    const priceChangeClass = token.priceChange24h >= 0 ? "positive" : "negative"

    document.getElementById("modalMarketCap").textContent = `$${this.formatNumber(token.marketCap)}`
    document.getElementById("modalPrice").textContent = `$${token.price.toFixed(6)}`
    document.getElementById("modalVolume24h").textContent = `$${this.formatNumber(token.volume24h)}`
    document.getElementById("modalMigrationVolume").textContent = `$${this.formatNumber(token.migrationVolume || 0)}`
    document.getElementById("modalPriceChange").textContent = `${token.priceChange24h.toFixed(2)}%`
    document.getElementById("modalPriceChange").className = `detail-value ${priceChangeClass}`
    document.getElementById("modalHolders").textContent = token.holders
  }

  async loadHolderData(token) {
    const holdersContainer = document.getElementById("holdersContainer")
    const riskAnalysis = token.riskAnalysis || { level: "unknown", reason: "No data available" }

    holdersContainer.innerHTML = `
      <div class="risk-analysis">
        <div class="risk-indicator risk-${riskAnalysis.level}">
          <span class="risk-icon">${this.getRiskIcon(riskAnalysis.level)}</span>
          <span class="risk-text">${riskAnalysis.level.toUpperCase()}</span>
        </div>
        <div class="risk-reason">${riskAnalysis.reason}</div>
      </div>
      <div class="loading-holders">Loading holder data...</div>
    `

    try {
      const response = await chrome.runtime.sendMessage({
        action: "getHolderData",
        tokenAddress: token.id,
      })

      if (response.success && response.data) {
        const holderData = response.data

        holdersContainer.innerHTML = `
          <div class="risk-analysis">
            <div class="risk-indicator risk-${riskAnalysis.level}">
              <span class="risk-icon">${this.getRiskIcon(riskAnalysis.level)}</span>
              <span class="risk-text">${riskAnalysis.level.toUpperCase()}</span>
            </div>
            <div class="risk-reason">${riskAnalysis.reason}</div>
          </div>
          <div class="holders-list"></div>
        `

        const holdersList = holdersContainer.querySelector(".holders-list")

        if (holderData.holders && holderData.holders.length > 0) {
          holderData.holders.forEach((holder) => {
            const holderElement = document.createElement("div")
            holderElement.className = "holder-item"
            holderElement.innerHTML = `
              <span class="holder-rank">#${holder.rank}</span>
              <span class="holder-address">${this.truncateAddress(holder.address)}</span>
              <span class="holder-percentage">${holder.percentage}%</span>
            `
            holdersList.appendChild(holderElement)
          })
        } else {
          holdersList.innerHTML = '<div class="loading-holders">No holder data available</div>'
        }
      }
    } catch (error) {
      console.error("Error loading holder data:", error)
    }
  }

  getRiskIcon(level) {
    switch (level) {
      case "risky":
        return "⚠️"
      case "okay":
        return "✅"
      case "analyzing":
        return "🔄"
      default:
        return "❓"
    }
  }

  truncateAddress(address) {
    if (!address || address.length < 8) return address
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  closeTokenDetail() {
    document.getElementById("tokenDetailModal").style.display = "none"
    this.currentToken = null
  }

  async copyContractAddress() {
    if (!this.currentToken) return

    try {
      await navigator.clipboard.writeText(this.currentToken.id)
      const btn = document.getElementById("copyAddressBtn")
      const originalText = btn.textContent
      btn.textContent = "✅ Copied!"
      btn.classList.add("copied")

      setTimeout(() => {
        btn.textContent = originalText
        btn.classList.remove("copied")
      }, 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  viewOnPump() {
    if (!this.currentToken) return
    chrome.tabs.create({
      url: `https://pump.fun/${this.currentToken.id}`,
    })
  }

  viewOnSolscan() {
    if (!this.currentToken) return
    chrome.tabs.create({
      url: `https://solscan.io/token/${this.currentToken.id}`,
    })
  }

  viewOnRaydium() {
    if (!this.currentToken) return
    chrome.tabs.create({
      url: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${this.currentToken.id}`,
    })
  }

  getTokenEmoji(name) {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("pepe")) return "🐸"
    if (lowerName.includes("doge")) return "🐕"
    if (lowerName.includes("cat")) return "🐱"
    if (lowerName.includes("moon")) return "🌙"
    if (lowerName.includes("rocket")) return "🚀"
    if (lowerName.includes("fire")) return "🔥"
    if (lowerName.includes("diamond")) return "💎"
    if (lowerName.includes("ape")) return "🐒"
    return "💎"
  }

  updateStats() {
    const migratedTokensCount = this.tokens.length
    const totalVolume = this.tokens.reduce((sum, token) => sum + token.volume24h, 0)

    let averageTime = "--"
    if (this.tokens.length > 0) {
      const totalMinutes = this.tokens.reduce((sum, token) => {
        return sum + (Date.now() - token.migratedAt) / (1000 * 60)
      }, 0)
      const avgMinutes = Math.round(totalMinutes / this.tokens.length)
      averageTime = `${avgMinutes}m`
    }

    document.getElementById("migratedTokensCount").textContent = migratedTokensCount
    document.getElementById("totalVolume").textContent = `$${this.formatNumber(totalVolume)}`

    const avgTimeElement = document.getElementById("averageTime")
    if (avgTimeElement) {
      avgTimeElement.textContent = averageTime
    }
  }

  showSettings() {
    alert(
      "GraduApe Migration Tracker (Moralis API):\n\n✅ API Key: Configured\n🔄 Polling: Every 30 seconds\n📊 Data: Real + Demo for testing\n⏰ Window: Last 20 minutes\n🎯 Quality: 50+ holders, $50K+ cap, $10K+ vol\n\nThe extension uses your Moralis API key to track real migrations and includes demo data for testing purposes.",
    )
  }

  showLoading(show) {
    document.getElementById("loadingSpinner").style.display = show ? "flex" : "none"
  }

  showError(message = "Connection error. Click refresh to retry.") {
    const errorElement = document.getElementById("errorMessage")
    errorElement.querySelector("span").textContent = message
    errorElement.style.display = "block"
  }

  hideError() {
    document.getElementById("errorMessage").style.display = "none"
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  getTimeAgo(timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return `${seconds}s ago`
    }
  }

  handleCleanup() {
    this.loadTokensFromBackground()
  }
}

// Initialize the popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GraduApePopup()
})
