## Prerequisites

- Git
- Node.js
- MariaDB 

## Setup Instructions

### 1. Cloning the Repository

First, fork this repository and then clone it to your local machine:

```bash
git clone [https://github.com/Miya-JW/blog_website]
cd [blog_website-name]
```

### 2.	Install Dependencies:

Navigate to the project directory and run:
```bash
npm install
```

### 3. Database Configuration

This project uses MariaDB for the database. Follow these steps to set up the database:

1. **Install MariaDB**: Ensure that MariaDB is installed on your machine. You can download it from [MariaDB's official website](https://mariadb.org/download/).

2. **Create Database**:
   Open your MariaDB command line client and execute the following commands:
   ```sql
   CREATE DATABASE blog_db;
   USE blog_db;
   ```

3. **Initialize Database**:
   Import the SQL schema provided in the db-init.sql file:
   ```spl 
    mysql -u username -p blog_db < path/to/db-init.sql
   ```

4. **Configure Environment**:
   Rename the .env.sample file to .env and update the database connection details:
  ```sql
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASS=your_password
    DB_NAME=blog_db
  ```


## Running the Application
To run the application, execute:
```bash
node app.js
```

## Testing the Application

To test the application with pre-configured test user accounts, use the following credentials:

	•	Username: batman
	•	Password: 12345
	•	Username: iron_man
	•	Password: 12345
    •	Username: captain_america
	•	Password: 12345



