from pulp import LpProblem, LpVariable, lpSum, LpMinimize, LpStatus
import pulp
print(pulp.listSolvers())

# Example employees, projects, skills, and availability
employees = ["Alice", "Bob", "Charlie"]
projects = ["Project A", "Project B"]

# Employee skills and availability
skills = {"Alice": ["Editing", "Writing"], "Bob": ["Shooting", "Editing"], "Charlie": ["Writing", "Shooting"]}
availability = {"Alice": [9, 10, 11], "Bob": [10, 11, 12], "Charlie": [8, 9, 10]}

# Project requirements (skills and time)
project_requirements = {
    "Project A": {"skills": ["Editing"], "time": [9, 10]},
    "Project B": {"skills": ["Shooting"], "time": [10, 11]},
}

# Decision variables: 1 if assigned, 0 otherwise
x = {(e, p): LpVariable(f"x_{e}_{p}", cat="Binary") for e in employees for p in projects}

# Define the problem
prob = LpProblem("Resource_Optimization", LpMinimize)

# Constraints: Each project must have one employee assigned
for p in projects:
    prob += lpSum(x[e, p] for e in employees) == 1  # Assign each project to exactly one employee

# Skill and availability matching constraints
for e in employees:
    for p in projects:
        # Skill matching: Employee must have the required skill for the project
        prob += x[e, p] <= int(any(skill in skills[e] for skill in project_requirements[p]["skills"]))
        
        # Availability matching: Employee must be available at the required time
        prob += x[e, p] <= int(any(time in availability[e] for time in project_requirements[p]["time"]))

# Objective: Minimize mismatches
prob += lpSum(x[e, p] * (1 - int(any(skill in skills[e] for skill in project_requirements[p]["skills"])) + 
                         1 - int(any(time in availability[e] for time in project_requirements[p]["time"]))) 
              for e in employees for p in projects)

# Solve the problem
prob.solve(pulp.GLPK_CMD())

# Print results
print("Assignments:")
for e in employees:
    for p in projects:
        if x[e, p].varValue == 1:
            print(f"{e} is assigned to {p}")

print(f"Solver Status: {LpStatus[prob.status]}")