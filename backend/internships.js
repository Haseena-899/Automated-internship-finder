document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/internships'); // Backend endpoint
        const data = await response.json();

        const internshipList = document.getElementById('internship-list');
        internshipList.innerHTML = ''; // Clear loading

        if (data.length === 0) {
            internshipList.innerHTML = '<p class="text-center">No internships found.</p>';
            return;
        }

        data.forEach(internship => {
            const card = document.createElement('div');
            card.className = 'card mb-3';

            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${internship.title}</h5>
                    <p class="card-text"><strong>Company:</strong> ${internship.company}</p>
                    <p class="card-text"><strong>Location:</strong> ${internship.location}</p>
                    <p class="card-text"><strong>Description:</strong> ${internship.description}</p>
                    <a href="${internship.url}" target="_blank" class="btn btn-primary">View Details</a>
                </div>
            `;

            internshipList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading internships:', error);
    }
});
