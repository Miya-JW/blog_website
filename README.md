# Blog Websit

## Introduction

This blogging platform is a capstone of my first semester in the master's program, specifically from the Programming with Web Technologies course. With no prior experience in IT, I have leveraged 16 comprehensive lessons covering HTML, CSS, JavaScript, AJAX, Node.js, and databases to develop this project. The website demonstrates a complete solution for online content management and interaction, showcasing my rapid learning capabilities and the application of advanced web development skills. It integrates front-end design, server-side processing, and database management to offer dynamic user interactions and sophisticated content handling capabilities. This project not only demonstrates my ability to quickly grasp and apply complex technologies but also highlights the robustness of the web platform in facilitating effective communication and content sharing.

## Project Highlights

- **Integrated Login and Registration**: Seamlessly integrated the login and registration pages into a single, dynamic interface. This dual-purpose module uses an innovative sliding mechanism to switch between ‘Log In’ and ‘Register’ forms, enhancing user engagement and reducing navigational friction.

- **Responsive Design**: The website features a fluid design that adapts beautifully across different devices and screen sizes, ensuring an optimal viewing experience whether on desktop, tablet, or mobile. This responsive behavior is crucial for modern web applications, reflecting best practices in UI/UX design.

- **Aesthetic and Functional UI**: The user interface combines elegance and functionality, with a clean, modern look that makes navigation intuitive. The aesthetic design is not only visually pleasing but also enhances the overall usability of the site, encouraging longer engagement times by users.

- **Advanced Text Editing**: Integrated a WYSIWYG editor to empower users to create rich content without HTML knowledge, simplifying the content creation process while allowing users full control over the formatting of their blog posts.

- **Dynamic User Interaction**: Real-time feedback on user input, such as username availability and password strength, enhances the user experience by providing immediate validation and ensuring data integrity.

- **Modern Web Practices**: Utilized AJAX and Fetch API for seamless page updates and asynchronous data handling, which allows for a smoother and more dynamic user experience without reloading the page.

- **Interactive Content Features**: Users can engage with content through features like liking and commenting, which are designed to increase interactivity and community engagement on the platform. The comments section is particularly notable for its ability to support threaded discussions, making it easy for users to follow conversations.

## Screenshots

### Home Page
![Home Page](/screenshots/home_page.png)

### Login/Registration Page
![Login Page](/screenshots/login.png)
![Registration Page](/screenshots/register.png)

### Profile Page
![Profile Page](/screenshots/profile.png)

### User Main Page
![User Main Page](/screenshots/user_main_page.png)

### Comments
![Comments](/screenshots/comment.png)

## Installation and Setup

For detailed setup instructions, including setting up the database and running the application, see the [Setup Guide](./SETUP.md).

## Technologies Used

- **Front-end**: HTML, CSS, JavaScript
- **Back-end**: Node.js, Express
- **Database**: MariaDB
- **Libraries**: bcrypt for hashing passwords, dotenv for environment variables

## Project Structure

This project is structured into several directories and files, each serving a specific purpose:

- `modules/`: Contains data access objects (DAOs) for handling all database operations.
  - `articles-dao.js`: Manages database operations related to articles.
  - `comments-dao.js`: Handles database interactions for comments.
  - `database.js`: Sets up the database connection and configuration.
  - `likes-dao.js`: Manages likes data.
  - `users-dao.js`: Handles user information and authentication.
  

- `public/`: Contains all static assets used by the client side.
  - `avatar/`: Stores avatar images.
  - `controllers/`: JavaScript files that handle client-side logic.
  - `css/`: Stylesheets for the application styling.
  - `image/`: Contains images used throughout the application.
  - `screenshots/`: Screenshots used in documentation like README.

- `routes/`: Holds the routing logic of the application.

- `sql/`: Contains SQL scripts.
  - `init-db.sql`: Script to initialize the database schema and seed data.

- `views/`: Handlebars templates for generating HTML.
  - `layouts/`: Base templates for the application.

- Root Directory:
  - `.env.sample`: Sample environment file to set up `.env`.
  - `.gitignore`: Specifies intentionally untracked files to ignore.
  - `app.js`: The main application file.
  - `package.json`: Lists packages and their dependencies.
  - `package-lock.json`: Locks the versions of the packages installed.

This structured approach ensures that the application is organized and maintainable. It also simplifies the navigation through different parts of the project for developers.
