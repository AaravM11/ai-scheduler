// Wait for the page to load before executing the script
document.addEventListener("DOMContentLoaded", function () {
    // Get references to form and result div
    const form = document.getElementById('project-form');
    const resultDiv = document.getElementById('assignment-result');

    // Handle form submission
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission behavior

        // Step 1: Collect data from form fields
        const availablePeople = document.getElementById('available_people').value
            .split(',')
            .map(person => person.trim());

        const skills = JSON.parse(document.getElementById('skills').value);
        const availability = JSON.parse(document.getElementById('availability').value);
        const projects = JSON.parse(document.getElementById('projects').value);
        const rates = JSON.parse(document.getElementById('rates').value);
        const deadlines = JSON.parse(document.getElementById('deadlines').value);

        // Step 2: Construct data object to send to backend
        const data = {
            available_people: availablePeople,
            skills: skills,
            availability: availability,
            projects: projects,
            rates: rates,
            deadlines: deadlines
        };

        try {
            // Step 3: Send data to Flask backend using fetch
            const response = await fetch('/assign_projects', {
                method: 'POST', // POST request
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Convert JS object to JSON string
            });

            // Step 4: Parse the JSON response
            const result = await response.json();

            // Step 5: Display the assignment results
            if (result.status === "Optimal") {
                let assignments = '';
                for (const project in result.assignments) {
                    assignments += `${project}: ${result.assignments[project]}<br>`;
                }
                resultDiv.innerHTML = `<strong>Assignments:</strong><br>${assignments}`;
            } else {
                resultDiv.innerHTML = `<strong>Error:</strong> No optimal assignment found.`;
            }
        } catch (error) {
            // Step 6: Handle errors
            resultDiv.innerHTML = `<strong>Error:</strong> Something went wrong, please try again.`;
            console.error('Error during fetch:', error);
        }
    });
});
