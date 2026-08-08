document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('subjectSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const subjectCards = document.querySelectorAll('.subject-card');
    const sectionBlocks = document.querySelectorAll('.section-block');

    let currentBranchFilter = 'all';

    // Function to filter cards based on branch pill & search query
    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        sectionBlocks.forEach(section => {
            const sectionBranch = section.dataset.branch;
            let visibleCardsInSection = 0;

            const cards = section.querySelectorAll('.subject-card');
            cards.forEach(card => {
                const subjectText = card.dataset.subject ? card.dataset.subject.toLowerCase() : '';
                const cardBranch = card.dataset.branch;

                const matchesBranch = (currentBranchFilter === 'all') || (cardBranch === currentBranchFilter);
                const matchesSearch = query === '' || subjectText.includes(query);

                if (matchesBranch && matchesSearch) {
                    card.style.display = 'block';
                    visibleCardsInSection++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Hide whole section heading if no cards match
            if (visibleCardsInSection > 0) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    // Event listener for Branch Filter Pills
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBranchFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // Event listener for Search Bar Input
    if (searchInput) {
        searchInput.addEventListener('keyup', applyFilters);
    }
});

// Mobile Hamburger Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('show');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('show');
    }
  });
}
