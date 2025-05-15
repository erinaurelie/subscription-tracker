On the Frontend we use HTML, CSS, JS and chartJS for data visualization.
On the backend we use Node Js and Express, MongoDB as database we use Arcjet as middleware for bot protection and rate limiting, we use upstash to automate our reminder workflows and we use Json Web Token for Authentication.

# Subscription Management Web App

A Node.js-based subscription management application allows users to manage their subscriptions, track spending, and visualize data. This project is built with Express.js for the backend and includes features like user authentication, subscription tracking, and data visualization.

## Features
- **User Authentication**: Secure sign-up and login functionality.
- **Subscription Management**: Add, edit, and delete subscriptions.
- **Data Visualization**: View spending breakdowns and trends using charts.
- **RESTful API**: Fully functional API for managing users and subscriptions.
- **Error Handling**: Centralized error handling for better debugging.
- **Automated Reminder Workflows**: When your subscription is almost due e.g. 7days, 3days you would get a an email to remind you to either update ur subscription or cancel it.


# Teach Stack

### Backend
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user and subscription data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: For secure user authentication.
- **Day.js**: For date manipulation.
- **Upstash**: To automate reminder workflows
-**Arcjet**: Bot protection and Rate limiting

### Frontend
- **HTML/CSS/JavaScript**: For the user interface.
- **Chart.js**: For data visualization.


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/erinaurelie/subscription-tracker.git
   cd subscription-tracker

2. Install dependencies
``` npm install


3. Create a new file named `.env.local` in the root of your project and add the following content:

```env
# PORT
PORT=5500
SERVER_URL="http://localhost:5500"

# ENVIRONMENT
NODE_ENV=development

# DATABASE
DB_URI=

# JWT AUTH
JWT_SECRET=
JWT_EXPIRES_IN="1d"

# ARCJET
ARCJET_KEY=
ARCJET_ENV="development"

# UPSTASH
QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=

# NODEMAILER
EMAIL_PASSWORD=
```
4. Run the Project

```bash
npm run dev
```

Open [http://localhost:5500](http://localhost:5500) in your browser or any HTTP client to test the project.

This project I started by following the JS mastery tutorial on youtube for the backend only check it out [here](https://www.youtube.com/watch?v=rOpEN1JDaD0&t)

you can only he's [README.md](https://github.com/adrianhajdin/subscription-tracker-api/blob/main/README.md)

I built the frontend myself and connect it to the backend. (You can probably tell by how messy the code is lol)

**Contact me**
email: erinaureliebusiness@gmail.com