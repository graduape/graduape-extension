// Content script for pump.fun integration
class GraduApeContent {
  constructor() {
    if (window.location.hostname === "pump.fun") {
      this.init()
    }
  }

  init() {
    this.injectStyles()
    this.addGraduApeButton()
    this.observeTokens()
  }

  injectStyles() {
    const style = document.createElement("style")
    style.textContent = `
            .graduape-button {
                background: #00ff88;
                color: #000;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: bold;
                cursor: pointer;
                margin-left: 8px;
                font-size: 12px;
            }
            .graduape-button:hover {
                background: #00cc6a;
            }
            .graduape-highlight {
                border: 2px solid #00ff88 !important;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.3) !important;
            }
        `
    document.head.appendChild(style)
  }

  addGraduApeButton() {
    // Add GraduApe tracking button to token cards
    const observer = new MutationObserver(() => {
      const tokenCards = document.querySelectorAll("[data-token-card]:not(.graduape-enhanced)")
      tokenCards.forEach((card) => {
        this.enhanceTokenCard(card)
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  enhanceTokenCard(card) {
    card.classList.add("gradu-enhanced")

    const button = document.createElement("button")
    button.className = "graduape-button"
    button.textContent = "🎓 Track"
    button.onclick = (e) => {
      e.stopPropagation()
      this.trackToken(card)
    }

    const buttonContainer = card.querySelector(".token-actions") || card
    buttonContainer.appendChild(button)
  }

  trackToken(card) {
    // Extract token information from the card
    const tokenData = this.extractTokenData(card)

    // Send to background script
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: "trackToken",
        token: tokenData,
      })
    }

    // Visual feedback
    card.classList.add("graduape-highlight")
    setTimeout(() => {
      card.classList.remove("graduape-highlight")
    }, 2000)
  }

  extractTokenData(card) {
    // Extract token information from pump.fun card
    return {
      name: card.querySelector(".token-name")?.textContent || "Unknown",
      symbol: card.querySelector(".token-symbol")?.textContent || "UNK",
      address: card.dataset.tokenAddress || "",
      marketCap: this.parseNumber(card.querySelector(".market-cap")?.textContent || "0"),
      volume: this.parseNumber(card.querySelector(".volume")?.textContent || "0"),
      timestamp: Date.now(),
    }
  }

  parseNumber(text) {
    const cleaned = text.replace(/[^0-9.]/g, "")
    return Number.parseFloat(cleaned) || 0
  }

  observeTokens() {
    // Monitor for new tokens appearing on the page
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tokenCards = node.querySelectorAll("[data-token-card]")
            tokenCards.forEach((card) => {
              if (!card.classList.contains("graduape-seen")) {
                card.classList.add("graduape-seen")
                this.notifyNewToken(card)
              }
            })
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  notifyNewToken(card) {
    // Highlight new tokens
    card.style.animation = "graduape-pulse 2s ease-in-out"

    // Send notification to extension
    const tokenData = this.extractTokenData(card)
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: "newTokenDetected",
        token: tokenData,
      })
    }
  }
}

// Initialize content script
new GraduApeContent()
