const projects = {};
const people = {};

document.getElementById('add-project-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('project-name').value;
    const skills = document.getElementById('project-skills').value.split(',').map(s => s.trim());
    const time = document.getElementById('project-time').value.split(',').map(t => parseInt(t.trim()));
    const deadline = parseInt(document.getElementById('project-deadline').value);
    const budget = document.getElementById('project-budget').value.split(',').map(b => parseInt(b.trim()));  // min, max
    const location = document.getElementById('project-location').value;

    projects[name] = { skills, time, deadline, budget, location };
    updateProjectsUI();
});

document.getElementById('add-person-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('person-name').value;
    const skills = document.getElementById('person-skills').value.split(',').map(s => s.trim());
    const availability = document.getElementById('person-availability').value.split(',').map(a => parseInt(a.trim()));
    const rates = document.getElementById('person-rates').value.split(',').map(r => parseInt(r.trim()));
    const location = document.getElementById('person-location').value;

    people[name] = { skills, availability, rates, location };
    updatePeopleUI();
});

function updateProjectsUI() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    Object.entries(projects).forEach(([name, data]) => {
        const projectEl = document.createElement('div');
        projectEl.className = 'data-item';
        projectEl.innerHTML = `
            <strong>${name}</strong>
            <p>Skills: ${data.skills.join(', ')}</p>
            <p>Time: ${data.time.join(', ')}</p>
            <p>Deadline: ${data.deadline}</p>
            <p>Budget: ${data.budget.join(' - ')}</p>
            <p>Location: ${data.location}</p>
            <button onclick="removeProject('${name}')">Remove</button>
        `;
        projectList.appendChild(projectEl);
    });
}

function updatePeopleUI() {
    const personList = document.getElementById('person-list');
    personList.innerHTML = '';

    Object.entries(people).forEach(([name, data]) => {
        const personEl = document.createElement('div');
        personEl.className = 'data-item';
        personEl.innerHTML = `
            <strong>${name}</strong>
            <p>Skills: ${data.skills.join(', ')}</p>
            <p>Availability: ${data.availability.join(', ')}</p>
            <p>Rates: ${data.rates.join(' - ')}</p>
            <p>Location: ${data.location}</p>
            <button onclick="removePerson('${name}')">Remove</button>
        `;
        personList.appendChild(personEl);
    });
}

function removeProject(name) {
    delete projects[name];
    updateProjectsUI();
}

function removePerson(name) {
    delete people[name];
    updatePeopleUI();
}

document.getElementById('run-optimization').addEventListener('click', async () => {
    const response = await fetch('/assign_projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            available_people: Object.keys(people),
            skills: Object.fromEntries(Object.entries(people).map(([k, v]) => [k, v.skills])),
            availability: Object.fromEntries(Object.entries(people).map(([k, v]) => [k, v.availability])),
            projects,
            rates: Object.fromEntries(Object.entries(people).map(([k, v]) => [k, v.rates])),
            deadlines: Object.fromEntries(Object.entries(projects).map(([k, v]) => [k, v.deadline])),
            locations: Object.fromEntries(Object.entries(projects).map(([k, v]) => [k, v.location]))  // Send project locations
        })
    });

    const result = await response.json();
    alert(`Assignments:\n${JSON.stringify(result.assignments, null, 2)}`);
});
