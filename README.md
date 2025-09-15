# Introduction

Novel is a full-stack web application built with the MERN stack. It dynamically scrapes comic information and pages from various online sources and presents them in a clean, user-friendly interface for reading.

## Demo

A full video demonstration of the application's features can be found here:

➡️ **[View Demo Videos](https://drive.google.com/drive/folders/1EXyaDdK_M0uTLXsahPPF455Je-FarREi)**


## Features

- **Browse & Discover:** View a vast collection of comics on the homepage with pagination.
- **Search:** Instantly search for comics by title.
- **Detailed Information:** Get details for each comic, including genres, author, status, and a full chapter list.
- **Seamless Reader:** A clean, vertical reader experience.
- **Chapter Navigation:** Easily switch between chapters using next/previous buttons or a dropdown menu.
- **User Accounts:** Secure registration and login system using JWT for authentication.
- **Personalized Lists:**
    - **Following:** Follow your favorite comics to keep track of them.
    - **Reading History:** Automatically saves your reading progress.

## Techs tack

| Category     | Technology                                                    |
|--------------|---------------------------------------------------------------|
| **Frontend** | React, React Router, Axios                                    |
| **Backend**  | Node.js, Express.js                                           |
| **Database** | MongoDB with Mongoose                                         |
| **Scraping** | Cheerio, Axios / Puppeteer                                    |
| **Auth**     | JSON Web Tokens (JWT)                                         |
| **Styling**  | CSS / SASS (or your chosen library like Material-UI/Tailwind) |


## Project Structure

The project is organized into two main directories:

- **/back-end:** The Node.js & Express.js backend. It handles API logic, web scraping, database interactions, and user authentication.
- **/front-end:** The React frontend. It provides the user interface and consumes the data from the server's API.

---

## Running the Application

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your machine, or a MongoDB Atlas connection string.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/teri1712/novel.git
    cd novel
    ```

2.  **Set up the Backend:**
    ```sh
    # Navigate to the server directory
    cd back-end

    # Install dependencies
    npm install


3.  **Set up the Frontend:**
    ```sh
    # Navigate to the front-end directory from the root
    cd ../front-end

    # Install dependencies
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```sh
    # From the /server directory
    npm start
    ```
    The server should now be running on `http://localhost:8080` (or the port you specified).

2.  **Start the Frontend Development Server:**
    ```sh
    # From the /front-end directory (in a new terminal)
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.