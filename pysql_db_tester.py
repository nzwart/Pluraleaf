import mysql.connector


# Read SQL commands from an external file.
def read_sql_file(filename):
    with open(filename, "r") as file:
        return file.read().split(";")[:-1]


def test_db(config, database_name):
    # Connect to the database and read SQL commands from test file.
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    # Drop the overall db if it exists and create a new one.
    cursor.execute(f"DROP DATABASE IF EXISTS {database_name};")
    cursor.execute(f"CREATE DATABASE {database_name};")
    conn.commit()

    # Add database to the mysql connector config.
    conn.close()  # Close the previous connection to reconnect with the new database
    config_with_db = config.copy()
    config_with_db["database"] = database_name
    conn = mysql.connector.connect(**config_with_db)
    cursor = conn.cursor()

    commands = read_sql_file("test.sql")

    # Execute SQL commands to set up the database
    for command in commands:
        cursor.execute(command)
    conn.commit()
    print("Database setup completed.")

    # Test queries.
    cursor.execute("SELECT * FROM employees;")
    employees = cursor.fetchall()
    print("Employees:", employees)
    cursor.execute("SELECT * FROM departments;")
    departments = cursor.fetchall()
    print("Departments:", departments)

    # Drop the tables and close connection.
    cursor.execute("DROP TABLE IF EXISTS employees, departments;")
    conn.commit()
    print("Tables dropped successfully.")
    cursor.close()
    conn.close()


def main():
    # Database connection parameters, taken from the docker run command included in the readme.
    config = {
        "user": "usr1",
        "password": "my_cool_secret",
        "host": "127.0.0.1",
        "port": "3306",
    }

    database_name = "340_project3_draft_db"
    
    
    # Test the db.
    test_db(config, database_name)


if __name__ == "__main__":
    main()
