import { useState } from 'react';

function Scheduler() {
  const [result, setResult] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      available_people: event.target.available_people.value.split(',').map(p => p.trim()),
      skills: JSON.parse(event.target.skills.value),
      availability: JSON.parse(event.target.availability.value),
      projects: JSON.parse(event.target.projects.value),
      rates: JSON.parse(event.target.rates.value),
      deadlines: JSON.parse(event.target.deadlines.value)
    };

    const response = await fetch('/assign_projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    setResult(JSON.stringify(result.assignments, null, 2));
  };

  return (
    <div className="container">
      <h1>Project Assignment</h1>
      <form onSubmit={handleSubmit}>
        <label>Available People (comma separated):</label>
        <input type="text" name="available_people" required />

        <label>Skills (JSON format):</label>
        <textarea name="skills" required></textarea>

        <label>Availability (JSON format):</label>
        <textarea name="availability" required></textarea>

        <label>Projects (JSON format):</label>
        <textarea name="projects" required></textarea>

        <label>Rates (JSON format):</label>
        <textarea name="rates" required></textarea>

        <label>Deadlines (JSON format):</label>
        <textarea name="deadlines" required></textarea>

        <button type="submit">Submit</button>
      </form>
      <h3>Assignment Result</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default Scheduler;
