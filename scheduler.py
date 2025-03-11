from pulp import LpProblem, LpVariable, lpSum, LpMinimize, LpStatus
import pulp

# Example Teamium Data
available_people = ["Alice", "Bob", "Charlie"]  # List of available people
skills = {"Alice": ["Editing", "Writing"], "Bob": ["Shooting", "Editing"], "Charlie": ["Writing", "Shooting"]}
availability = {"Alice": [9, 10, 11], "Bob": [10, 11, 12], "Charlie": [8, 9, 10]}

# Project requirements
projects = {
    "Project X": {"skills": ["Editing"], "time": [9, 10]},
    "Project Y": {"skills": ["Shooting"], "time": [10, 11]},
    "Project Z": {"skills": ["Writing"], "time": [8, 9]}
}

# Decision variables: Assign only one person per project
x = {e: {p: LpVariable(f"x_{e}_{p}", cat="Binary") for p in projects} for e in available_people}

# Define the optimization problem
prob = LpProblem("Multi_Project_Assignment", LpMinimize)

# Constraint: Assign exactly one person to each project
for p in projects:
    prob += lpSum(x[e][p] for e in available_people) == 1  # Assign each project to exactly one person

# Skill and availability constraints
for e in available_people:
    for p in projects:
        # Ensure only a qualified person can be assigned
        prob += x[e][p] <= int(any(skill in skills[e] for skill in projects[p]["skills"]))
        
        # Ensure the person is available at the required time
        prob += x[e][p] <= int(any(time in availability[e] for time in projects[p]["time"]))

# Objective: Minimize mismatches (based on skill and availability)
prob += lpSum(
    x[e][p] * (1 - int(any(skill in skills[e] for skill in projects[p]["skills"])) +
               1 - int(any(time in availability[e] for time in projects[p]["time"])))
    for e in available_people for p in projects
)

# Solve the problem
prob.solve(pulp.GLPK_CMD())  # Using PuLP’s default solver

# Print assignments for each project
print("Assignments:")
for p in projects:
    for e in available_people:
        if x[e][p].varValue == 1:
            print(f"{e} is assigned to {p}")

print(f"Solver Status: {LpStatus[prob.status]}")
