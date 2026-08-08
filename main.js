// Functionality: Search/Filter Subjects in real-time
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('subjectSearch');
    const subjectList = document.getElementById('subjectList');
    const subjectCards = subjectList.getElementsByClassName('subject-card');

    searchInput.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();

        // Loop through all subject cards and hide those that don't match the query
        Array.from(subjectCards).forEach((card) => {
            const subjectName = card.dataset.subject.toLowerCase();
            
            if (subjectName.includes(searchString)) {
                card.style.display = 'block'; // Show matching card
            } else {
                card.style.display = 'none';  // Hide non-matching card
            }
        });
    });
});