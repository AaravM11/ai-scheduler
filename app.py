from flask import Flask, request, jsonify, render_template
from pulp import LpProblem, LpVariable, lpSum, LpMinimize, LpStatus, GLPK_CMD

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html') 

@app.route('/assign_projects', methods=['POST'])
def assign_projects():
    data = request.get_json()

    available_people = data['available_people']
    skills = data['skills']
    availability = data['availability']
    projects = data['projects']
    rates = data.get('rates', {})  # Rate ranges for each person (hourly)
    deadlines = data.get('deadlines', {})  # Deadline for each project (end time)

    # Decision variables: Assign only one person per project
    x = {e: {p: LpVariable(f"x_{e}_{p}", cat="Binary") for p in projects} for e in available_people}

    # Define the optimization problem
    prob = LpProblem("Multi_Project_Assignment", LpMinimize)

    # Constraint: Assign exactly one person to each project
    for p in projects:
        prob += lpSum(x[e][p] for e in available_people) == 1

    # Skill and availability constraints
    for e in available_people:
        for p in projects:
            # Ensure only a qualified person can be assigned
            prob += x[e][p] <= int(any(skill in skills[e] for skill in projects[p]["skills"]))

            # Ensure the person is available at the required time
            prob += x[e][p] <= int(any(time in availability[e] for time in projects[p]["time"]))

            # Ensure the person is available before the project's deadline
            if p in deadlines:
                prob += x[e][p] <= int(any(time <= deadlines[p] for time in availability[e]))

    # Objective: Minimize mismatches (based on skill and availability), and factor in rate and deadlines
    prob += lpSum(
        x[e][p] * (
            1 - int(any(skill in skills[e] for skill in projects[p]["skills"])) +
            1 - int(any(time in availability[e] for time in projects[p]["time"])) +
            1 - int(any(time <= deadlines[p] for time in availability[e]))
        )
        for e in available_people for p in projects
    )
    
    # Add cost to objective (rate * hours worked, assuming 1 unit of time = 1 hour)
    for e in available_people:
        for p in projects:
            if e in rates:
                rate = random.uniform(rates[e][0], rates[e][1])  # Random rate between min and max
                prob += lpSum(x[e][p] * rate)  # Add cost to the objective function

    # Solve the problem
    prob.solve(GLPK_CMD())  # Using GLPK solver

    # Prepare the results
    assignments = {}
    for p in projects:
        for e in available_people:
            if x[e][p].varValue == 1:
                assignments[p] = e

    result = {
        "assignments": assignments,
        "status": LpStatus[prob.status]
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
