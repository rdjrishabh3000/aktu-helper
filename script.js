document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addNotesForm");
  const searchInput = document.getElementById("searchInput");
  const filterBranch = document.getElementById("filterBranch");
  const filterSem = document.getElementById("filterSem");

  // Load existing notes saved in LocalStorage
  loadSavedNotes();

  // 1. Handle Form Submission
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

  // 2. Attach Filter Listeners
  if (searchInput) searchInput.addEventListener("input", filterCards);
  if (filterBranch) filterBranch.addEventListener("change", filterCards);
  if (filterSem) filterSem.addEventListener("change", filterCards);
});

// Save to browser storage
function saveNoteToStorage(note) {
  let notes = JSON.parse(localStorage.getItem("aktu_user_notes")) || [];
  notes.push(note);
  localStorage.setItem("aktu_user_notes", JSON.stringify(notes));
}

// Load notes from storage on boot
function loadSavedNotes() {
  let notes = JSON.parse(localStorage.getItem("aktu_user_notes")) || [];
  notes.forEach(renderCard);
}

// Generate Card HTML and append to container
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

// Combined Search + Branch + Semester Filter
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

    // Show card only if all three filters pass
    if (matchesSearch && matchesBranch && matchesSem) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}