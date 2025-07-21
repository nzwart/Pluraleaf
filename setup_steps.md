Main project in CS 340.

# Running and Testing a MariaDB SQL Database Locally

## First steps

1. Install Poetry, the Python environment manager (the link should provide a few different ways to do this; I can't remember what I used when I originall installed Poetry, unfortunately, but it should be easy): https://python-poetry.org/docs/
2. Install Docker (required for the local MariaDB setup) if not already installed: https://docs.docker.com/engine/install/
3. Clone this repository to a parent directory on your machine (i.e. a projects directory) by running this from the command line while in that projects directory: `git clone https://github.com/nzwart/340_project_step2_draft.git`

## Starting the MariaDB Docker container

1. Run `chmod +x setup_pluraleaf_db_container.sh` from the project directory.

2. Run `./setup_pluraleaf_db_container.sh` from the project directory.

## Starting the Python environment

1. Run `poetry install` from the command line in the project directory.
2. Run `poetry shell` from the command line in the project directory.

## Testing the SQL db

1. Run `poetry run python pysql_db_tester.py` from the command line in the project directory. We might see something that says "consider moving TOML configuration..." -- ignore this. What we're ultimately looking for in the terminal is this:
```bash
Database setup completed.
Employees: [(1, 'Alice', 'Developer', Decimal('70000.00')), (2, 'Bob', 'Designer', Decimal('65000.00')), (3, 'Charlie', 'Manager', Decimal('80000.00'))]
Departments: [(1, 'IT', 'Building A'), (2, 'HR', 'Building B')]
Tables dropped successfully.
```
If you see this, the local MariaDB Docker database is working as expected. If not, let me know and I'll help troubleshoot.

# Running the uvicorn server

## Startup and reaching the index

1. Make sure poetry is running per the steps above, and all necessary dependencies are installed. (Note: new dependencies were added for this phase.) Run `poetry install` in the project directory if you're not sure.

2. Run `uvicorn app:app --reload` in the project directory. You should see something like this:
```bash
Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

3. Open a web browser and navigate to http://127.0.0.1:8000. You should see our index at that point.
