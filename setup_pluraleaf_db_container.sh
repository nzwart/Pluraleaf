#!/bin/bash

# Start MariaDB container
docker run -p 3306:3306 --detach --name pluraleaf-mariadb \
  --env MARIADB_USER=usr1 \
  --env MARIADB_PASSWORD=my_cool_secret \
  --env MARIADB_ROOT_PASSWORD=1234 \
  --env MARIADB_DATABASE=340_project_db \
  -v $(pwd)/ddl.sql:/docker-entrypoint-initdb.d/ddl.sql \
  mariadb:latest

# Wait for MariaDB to be fully up and ready
echo "Waiting for PluraLeaf MariaDB container to initialize..."
while ! docker exec pluraleaf-mariadb mariadb -u root -p1234 -e "SELECT 1" &> /dev/null; do
    sleep 1
done
echo "PluraLeaf MariaDB container is up and running."

# Run SQL commands inside the MariaDB container
docker exec -i pluraleaf-mariadb mariadb -u root -p1234 << EOF
USE mysql;
GRANT ALL PRIVILEGES ON *.* TO 'usr1'@'%' IDENTIFIED BY 'my_cool_secret' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

echo "Setup complete."
