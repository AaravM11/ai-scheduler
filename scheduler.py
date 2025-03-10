from pulp import LpProblem, LpVariable, lpSum, LpMinimize, LpStatus

# Sample scheduling problem
employees = ["Alice", "Bob", "Charlie"]
tasks = ["Edit Video", "Shoot Scene", "Write Script"]

# Decision variables
x = {(e, t): LpVariable(f"x_{e}_{t}", cat="Binary") for e in employees for t in tasks}

# Define the problem
prob = LpProblem("Simple_Scheduler", LpMinimize)

# Constraints: Each task is assigned to exactly one employee
for t in tasks:
    prob += lpSum(x[e, t] for e in employees) == 1

# Solve
prob.solve()

# Print results
for e in employees:
    for t in tasks:
        if x[e, t].varValue == 1:
            print(f"{e} is assigned to {t}")

print(f"Solver Status: {LpStatus[prob.status]}")