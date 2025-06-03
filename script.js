document.addEventListener('DOMContentLoaded', () => {
    // Get all input elements that should trigger a resume update
    const inputs = document.querySelectorAll(
        '#fullName, #email, #phone, #linkedin, #github, #summary, #skills, ' +
        '.edu-institute, .edu-degree, .edu-year, ' +
        '.exp-company, .exp-position, .exp-duration, .exp-description, ' +
        '.proj-name, .proj-link, .proj-tech, .proj-description'
    );

    // Attach event listener to each input
    inputs.forEach(input => {
        input.addEventListener('input', updateResume);
    });

    // Initial update in case there are pre-filled values or placeholders
    updateResume();
});

function updateResume() {
    const resumeOutput = document.getElementById('resumeOutput');
    let htmlContent = '';

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const linkedin = document.getElementById('linkedin').value;
    const github = document.getElementById('github').value;
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value;

    // --- Personal Information ---
    if (fullName) {
        htmlContent += `<h2>${fullName}</h2>`;
    }
    const contactInfo = [];
    if (email) contactInfo.push(`<span><a href="mailto:${email}">${email}</a></span>`);
    if (phone) contactInfo.push(`<span>${phone}</span>`);
    if (linkedin) contactInfo.push(`<span><a href="${linkedin}" target="_blank">LinkedIn</a></span>`);
    if (github) contactInfo.push(`<span><a href="${github}" target="_blank">GitHub</a></span>`);

    if (contactInfo.length > 0) {
        htmlContent += `<p class="contact-info">${contactInfo.join(' | ')}</p>`;
    }

    // --- Summary ---
    if (summary) {
        htmlContent += `<h3>Summary</h3><p>${summary.replace(/\n/g, '<br>')}</p>`;
    }

    // --- Education ---
    const educationEntries = document.querySelectorAll('#educationInputs .education-entry');
    if (educationEntries.length > 0) {
        let educationHtml = '';
        educationEntries.forEach(entry => {
            const institute = entry.querySelector('.edu-institute').value;
            const degree = entry.querySelector('.edu-degree').value;
            const year = entry.querySelector('.edu-year').value;
            if (institute || degree || year) {
                educationHtml += `<li><strong>${degree}</strong>, ${institute} (${year})</li>`;
            }
        });
        if (educationHtml) {
            htmlContent += `<h3>Education</h3><ul class="no-bullets">${educationHtml}</ul>`;
        }
    }

    // --- Experience ---
    const experienceEntries = document.querySelectorAll('#experienceInputs .experience-entry');
    if (experienceEntries.length > 0) {
        let experienceHtml = '';
        experienceEntries.forEach(entry => {
            const company = entry.querySelector('.exp-company').value;
            const position = entry.querySelector('.exp-position').value;
            const duration = entry.querySelector('.exp-duration').value;
            const description = entry.querySelector('.exp-description').value;

            if (company || position || duration || description) {
                experienceHtml += `<h4>${position} at ${company}</h4>`;
                experienceHtml += `<p><em>${duration}</em></p>`;
                if (description) {
                    experienceHtml += `<ul>${description.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
                }
            }
        });
        if (experienceHtml) {
            htmlContent += `<h3>Experience</h3>${experienceHtml}`;
        }
    }

    // --- Projects ---
    const projectEntries = document.querySelectorAll('#projectInputs .project-entry');
    if (projectEntries.length > 0) {
        let projectHtml = '';
        projectEntries.forEach(entry => {
            const name = entry.querySelector('.proj-name').value;
            const link = entry.querySelector('.proj-link').value;
            const tech = entry.querySelector('.proj-tech').value;
            const description = entry.querySelector('.proj-description').value;

            if (name || link || tech || description) {
                projectHtml += `<h4>${name}`;
                if (link) {
                    projectHtml += ` - <a href="${link}" target="_blank">Link</a>`;
                }
                projectHtml += `</h4>`;
                if (tech) {
                    projectHtml += `<p><em>Technologies: ${tech}</em></p>`;
                }
                if (description) {
                    projectHtml += `<ul>${description.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
                }
            }
        });
        if (projectHtml) {
            htmlContent += `<h3>Projects</h3>${projectHtml}`;
        }
    }

    // --- Skills ---
    if (skills) {
        htmlContent += `<h3>Skills</h3><p>${skills}</p>`;
    }

    // Show placeholder if no content is generated yet
    if (!htmlContent.trim()) {
        resumeOutput.innerHTML = '<p class="placeholder-text">Your resume will appear here as you type.</p>';
    } else {
        resumeOutput.innerHTML = htmlContent;
    }
}

// Function to add new input entries for sections like Education, Experience, Projects
function addEntry(section) {
    const container = document.getElementById(`${section}Inputs`);
    const newEntry = document.createElement('div');
    newEntry.className = `${section}-entry`; // e.g., 'education-entry'

    let fieldsHtml = '';
    if (section === 'education') {
        fieldsHtml = `
            <input type="text" class="edu-institute" placeholder="Institute Name">
            <input type="text" class="edu-degree" placeholder="Degree/Program">
            <input type="text" class="edu-year" placeholder="Graduation Year (e.g., 2025)">
        `;
    } else if (section === 'experience') {
        fieldsHtml = `
            <input type="text" class="exp-company" placeholder="Company Name">
            <input type="text" class="exp-position" placeholder="Position">
            <input type="text" class="exp-duration" placeholder="Duration (e.g., Jan 2022 - Present)">
            <textarea class="exp-description" rows="3" placeholder="Key responsibilities and achievements"></textarea>
        `;
    } else if (section === 'project') {
        fieldsHtml = `
            <input type="text" class="proj-name" placeholder="Project Name">
            <input type="url" class="proj-link" placeholder="Project Link (Optional)">
            <input type="text" class="proj-tech" placeholder="Technologies Used (Comma-separated)">
            <textarea class="proj-description" rows="3" placeholder="Brief description of the project"></textarea>
        `;
    }

    newEntry.innerHTML = `
        ${fieldsHtml}
        <button type="button" class="remove-btn" onclick="removeEntry(this, '${section}')">Remove</button>
    `;
    container.appendChild(newEntry);

    // Attach event listeners to the newly added inputs
    newEntry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updateResume);
    });

    // Update resume immediately after adding a new blank entry
    updateResume();
}

// Function to remove an entry
function removeEntry(button, section) {
    const entryToRemove = button.parentNode;
    entryToRemove.remove();
    updateResume(); // Update resume after removing an entry
}