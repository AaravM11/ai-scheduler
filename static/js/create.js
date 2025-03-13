const projects = {};
const people = {};

document.getElementById('add-project-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('project-name').value;
    const skills = document.getElementById('project-skills').value.split(',').map(s => s.trim());
    const time = document.getElementById('project-time').value.split(',').map(t => parseInt(t.trim()));
    const deadline = parseInt(document.getElementById('project-deadline').value);

    projects[name] = { skills, time, deadline };
    updateSummary();
});

document.getElementById('add-person-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('person-name').value;
    const skills = document.getElementById('person-skills').value.split(',').map(s => s.trim());
    const availability = document.getElementById('person-availability').value.split(',').map(a => parseInt(a.trim()));
    const rates = document.getElementById('person-rates').value.split(',').map(r => parseInt(r.trim()));

    people[name] = { skills, availability, rates };
    updateSummary();
});

function updateSummary() {
    const summary = document.getElementById('summary-content');
    summary.textContent = `Projects:\n${JSON.stringify(projects, null, 2)}\n\nPeople:\n${JSON.stringify(people, null, 2)}`;
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
            deadlines: Object.fromEntries(Object.entries(projects).map(([k, v]) => [k, v.deadline]))
        })
    });

    const result = await response.json();
    alert(`Assignments:\n${JSON.stringify(result.assignments, null, 2)}`);
});
