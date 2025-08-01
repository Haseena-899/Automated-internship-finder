document.addEventListener('DOMContentLoaded', async () => {
    const internshipList = document.getElementById('internship-list');
    const messageElement = document.getElementById('message');
    internshipList.innerHTML = '';

    // Display loading message
    messageElement.textContent = 'Loading internships...';

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found. Please login.');
        }

        const response = await fetch('http://localhost:3001/api/rapidapi/internships', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            throw new Error('Invalid or expired token. Please login again.');
        }

        const data = await response.json();
        console.log('Received data:', data);

        internshipList.innerHTML = ''; // Clear loading text

        // Handle the specific data format received from the API
        const internships = Array.isArray(data) ? data : [];

        if (internships.length === 0) {
            messageElement.textContent = 'No internships found.';
            return;
        }

        messageElement.textContent = `Found ${internships.length} internship opportunities`;
        
        // Render each internship card
        internships.forEach(internship => {
            // Extract location from the locations_derived array
            const location = internship.locations_derived && internship.locations_derived.length > 0 
                ? internship.locations_derived[0] 
                : 'Remote/Not specified';
            
            // Format date
            const postDate = new Date(internship.date_posted).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const card = document.createElement('div');
            card.className = 'card mb-3 shadow-sm';

            // Determine if job is remote
            const isRemote = internship.remote_derived === true;
            const remoteTag = isRemote ? '<span class="badge bg-info me-2">Remote</span>' : '';
            
            // Format employment type
            const employmentType = internship.employment_type && internship.employment_type.length > 0 
                ? `<span class="badge bg-secondary me-2">${internship.employment_type[0]}</span>` 
                : '';

            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${internship.title || 'Internship Opportunity'}</h5>
                        ${internship.organization_logo ? 
                            `<img src="${internship.organization_logo}" alt="${internship.organization} logo" class="rounded" style="max-height: 40px; max-width: 80px;">` : 
                            ''}
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${internship.organization || 'Company'}</h6>
                    <p class="card-text mb-2">
                        <i class="bi bi-geo-alt"></i> ${location}
                        ${remoteTag}
                        ${employmentType}
                    </p>
                    <p class="card-text"><small class="text-muted">Posted: ${postDate}</small></p>
                    <a href="${internship.url}" class="btn btn-primary btn-sm" target="_blank">Apply Now</a>
                </div>
            `;

            internshipList.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading internships:', error);
        messageElement.textContent = error.message;
        messageElement.style.color = 'red';
    }
});