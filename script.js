/* ==========================================================================
   AKTU Helper - Main JavaScript (script.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileNav();
  initSubjectFilters();
  initAIChat();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById("theme-toggle");
  if (!themeBtn) return;

  // Load saved preference or default to dark
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);

  themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("open");
  });
}

/* --------------------------------------------------------------------------
   3. Subject & Notes Filter
   -------------------------------------------------------------------------- */
function initSubjectFilters() {
  const searchInput = document.getElementById("subject-search");
  const cards = document.querySelectorAll(".subject-card");

  if (!searchInput || cards.length === 0) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    cards.forEach((card) => {
      const title = card.querySelector(".subject-title")?.innerText.toLowerCase() || "";
      const code = card.querySelector(".subject-code")?.innerText.toLowerCase() || "";

      if (title.includes(query) || code.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. AKTU AI Assistant Integration
   -------------------------------------------------------------------------- */
function initAIChat() {
  const openBtn = document.getElementById("ai-widget-toggle");
  const closeBtn = document.getElementById("ai-widget-close");
  const chatWindow = document.getElementById("ai-chat-window");
  const sendBtn = document.getElementById("ai-send-btn");
  const input = document.getElementById("ai-chat-input");

  // Toggle Widget Window
  if (openBtn && chatWindow) {
    openBtn.addEventListener("click", () => chatWindow.classList.toggle("hidden"));
  }
  if (closeBtn && chatWindow) {
    closeBtn.addEventListener("click", () => chatWindow.classList.add("hidden"));
  }

  // Send Event Listeners
  if (sendBtn) {
    sendBtn.addEventListener("click", handleSend);
  }
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }
}

/* AI Request Handler (Calls Vercel Backend Serverless Endpoint) */
async function handleSend() {
  const input = document.getElementById("ai-chat-input");
  const userText = input ? input.value.trim() : "";

  if (!userText) return;

  // Display user message in UI
  appendMessage(userText, "user-msg");
  input.value = "";

  // Create loading placeholder message
  const loadingId = "loading-" + Date.now();
  appendMessage("Thinking...", "bot-msg", loadingId);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    const botReply = data.reply || data.error || "Sorry, I couldn't fetch an answer right now.";

    // Replace placeholder with final answer
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) {
      loadingEl.innerText = botReply;
    }
  } catch (error) {
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) {
      loadingEl.innerText = "Error connecting to AI Tutor. Please try again.";
    }
  }
}

/* Helper function to append message bubbles */
function appendMessage(text, className, elementId = null) {
  const chatBox = document.getElementById("ai-chat-messages");
  if (!chatBox) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${className}`;
  if (elementId) msgDiv.id = elementId;
  msgDiv.innerText = text;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}