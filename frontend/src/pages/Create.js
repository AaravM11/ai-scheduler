import { useState } from 'react';

const Create = () => {
    const [projects, setProjects] = useState({});
    const [people, setPeople] = useState({});

    // Handle adding a project
    const handleAddProject = (e) => {
        e.preventDefault();
        const name = e.target['project-name'].value;
        const skills = e.target['project-skills'].value.split(',').map(s => s.trim());
        const time = e.target['project-time'].value.split(',').map(t => parseInt(t.trim()));
        const deadline = parseInt(e.target['project-deadline'].value);
        const budget = e.target['project-budget'].value.split(',').map(b => parseInt(b.trim()));
        const location = e.target['project-location'].value;

        setProjects((prev) => ({
            ...prev,
            [name]: { skills, time, deadline, budget, location }
        }));

        e.target.reset(); // Clear the form after submission
    };

    // Handle adding a person
    const handleAddPerson = (e) => {
        e.preventDefault();
        const name = e.target['person-name'].value;
        const skills = e.target['person-skills'].value.split(',').map(s => s.trim());
        const availability = e.target['person-availability'].value.split(',').map(a => parseInt(a.trim()));
        const rates = e.target['person-rates'].value.split(',').map(r => parseInt(r.trim()));
        const location = e.target['person-location'].value;

        setPeople((prev) => ({
            ...prev,
            [name]: { skills, availability, rates, location }
        }));

        e.target.reset(); // Clear the form after submission
    };

    // Remove a project
    const removeProject = (name) => {
        setProjects((prev) => {
            const newProjects = { ...prev };
            delete newProjects[name];
            return newProjects;
        });
    };

    // Remove a person
    const removePerson = (name) => {
        setPeople((prev) => {
            const newPeople = { ...prev };
            delete newPeople[name];
            return newPeople;
        });
    };

    // Send data to the backend for optimization
    const handleRunOptimization = async () => {
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
                locations: Object.fromEntries(Object.entries(projects).map(([k, v]) => [k, v.location]))
            })
        });

        const result = await response.json();
        alert(`Assignments:\n${JSON.stringify(result.assignments, null, 2)}`);
    };

    return (
        <div className="container">
            <h1>Create Projects and People</h1>

            <div className="split-screen">
                {/* Project Form */}
                <div className="form-section">
                    <h3>Add a Project</h3>
                    <form onSubmit={handleAddProject}>
                        <input type="text" name="project-name" placeholder="Project Name" required />
                        <input type="text" name="project-skills" placeholder="Required Skills (comma separated)" required />
                        <input type="text" name="project-time" placeholder="Required Time (comma separated)" required />
                        <input type="number" name="project-deadline" placeholder="Deadline" required />
                        <input type="text" name="project-budget" placeholder="Budget (min, max)" required />
                        <input type="text" name="project-location" placeholder="Location" required />
                        <button type="submit">Add Project</button>
                    </form>

                    {/* Display Projects */}
                    {Object.entries(projects).map(([name, data]) => (
                        <div key={name} className="data-item">
                            <strong>{name}</strong>
                            <p>Skills: {data.skills.join(', ')}</p>
                            <p>Time: {data.time.join(', ')}</p>
                            <p>Deadline: {data.deadline}</p>
                            <p>Budget: {data.budget.join(' - ')}</p>
                            <p>Location: {data.location}</p>
                            <button onClick={() => removeProject(name)}>Remove</button>
                        </div>
                    ))}
                </div>

                {/* Person Form */}
                <div className="form-section">
                    <h3>Add a Person</h3>
                    <form onSubmit={handleAddPerson}>
                        <input type="text" name="person-name" placeholder="Person Name" required />
                        <input type="text" name="person-skills" placeholder="Skills (comma separated)" required />
                        <input type="text" name="person-availability" placeholder="Availability (comma separated)" required />
                        <input type="text" name="person-rates" placeholder="Rates (min, max)" required />
                        <input type="text" name="person-location" placeholder="Location" required />
                        <button type="submit">Add Person</button>
                    </form>

                    {/* Display People */}
                    {Object.entries(people).map(([name, data]) => (
                        <div key={name} className="data-item">
                            <strong>{name}</strong>
                            <p>Skills: {data.skills.join(', ')}</p>
                            <p>Availability: {data.availability.join(', ')}</p>
                            <p>Rates: {data.rates.join(' - ')}</p>
                            <p>Location: {data.location}</p>
                            <button onClick={() => removePerson(name)}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleRunOptimization} className="run-optimization">Run Optimization</button>
        </div>
    );
};

export default Create;