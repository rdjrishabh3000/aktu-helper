// AI Chat Widget Configuration
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------
  // 1. NOTES & PYQS FORM & FILTER LOGIC
  // -------------------------------------------------------------
  const form = document.getElementById("addNotesForm");
  const searchInput = document.getElementById("searchInput");
  const filterBranch = document.getElementById("filterBranch");
  const filterSem = document.getElementById("filterSem");

  // Load existing saved notes from browser storage
  loadSavedNotes();

  // Form submission handler
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("subjectName");
      const branchInput = document.getElementById("subjectBranch");
      const semInput = document.getElementById("subjectSem");
      const linkInput = document.getElementById("driveLink");

      const note = {
        id: Date.now(),
        name: nameInput.value.trim(),
        branch: branchInput.value,
        sem: semInput.value,
        link: linkInput.value.trim()
      };

      saveNoteToStorage(note);
      renderCard(note);

      form.reset();
    });
  }

  // Attach search and filter event listeners
  if (searchInput) searchInput.addEventListener("input", filterCards);
  if (filterBranch) filterBranch.addEventListener("change", filterCards);
  if (filterSem) filterSem.addEventListener("change", filterCards);

  // -------------------------------------------------------------
  // 2. FLOATING AI ASSISTANT LOGIC
  // -------------------------------------------------------------
  const toggleBtn = document.getElementById("ai-chat-toggle");
  const closeBtn = document.getElementById("ai-chat-close");
  const chatWindow = document.getElementById("ai-chat-window");
  const sendBtn = document.getElementById("ai-chat-send");
  const inputField = document.getElementById("ai-chat-input");

  if (toggleBtn) {
    // Toggle Window Visibility
    toggleBtn.addEventListener("click", () => chatWindow.classList.toggle("ai-hidden"));
    closeBtn.addEventListener("click", () => chatWindow.classList.add("ai-hidden"));

    // Send Message Triggers
    sendBtn.addEventListener("click", handleSend);
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }
});

/* LocalStorage Functions */
function saveNoteToStorage(note) {
  let notes = JSON.parse(localStorage.getItem("aktu_user_notes")) || [];
  notes.push(note);
  localStorage.setItem("aktu_user_notes", JSON.stringify(notes));
}

function loadSavedNotes() {
  let notes = JSON.parse(localStorage.getItem("aktu_user_notes")) || [];
  notes.forEach(renderCard);
}

/* UI Rendering Functions */
function renderCard(note) {
  const container = document.getElementById("notesContainer");
  if (!container) return;

  const cardHTML = `
    <div class="card" id="note-${note.id}" data-branch="${note.branch}" data-sem="${note.sem}">
      <div>
        <div class="badge-container">
          <span class="badge badge-branch">${note.branch}</span>
          <span class="badge badge-sem">${note.sem}</span>
        </div>
        <h3>${note.name}</h3>
        <p style="font-size: 0.85rem; color: #888;">Google Drive Resource</p>
      </div>
      <a href="${note.link}" target="_blank" rel="noopener noreferrer" class="btn-view">View Notes</a>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", cardHTML);
}

/* Multi-Filter Search Engine */
function filterCards() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const selectedBranch = document.getElementById("filterBranch").value;
  const selectedSem = document.getElementById("filterSem").value;
  const cards = document.querySelectorAll("#notesContainer .card");

  cards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const cardBranch = card.getAttribute("data-branch");
    const cardSem = card.getAttribute("data-sem");

    const matchesSearch = title.includes(query);
    const matchesBranch = selectedBranch === "ALL" || cardBranch === selectedBranch;
    const matchesSem = selectedSem === "ALL" || cardSem === selectedSem;

    if (matchesSearch && matchesBranch && matchesSem) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

/* AI Assistant Request Handler */
async function handleSend() {
  const input = document.getElementById("ai-chat-input");
  const userText = input.value.trim();

  if (!userText) return;

  // Append user prompt
  appendMessage(userText, "user-msg");
  input.value = "";

  // Append placeholder loading message
  const loadingId = "loading-" + Date.now();
  appendMessage("Thinking...", "bot-msg", loadingId);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert engineering tutor for AKTU university students. Provide concise, accurate, and easy-to-understand explanations for exam preparation.\n\nUser Question: ${userText}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process an answer at this moment.";

    // Replace loading text with response
    document.getElementById(loadingId).innerText = botReply;
  } catch (error) {
    document.getElementById(loadingId).innerText = "Error connecting to AI Tutor. Please check your connection.";
  }
}

function appendMessage(text, className, elementId = null) {
  const container = document.getElementById("ai-chat-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `ai-msg ${className}`;
  if (elementId) msgDiv.id = elementId;
  msgDiv.innerText = text;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}