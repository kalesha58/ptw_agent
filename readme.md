
# ptw_agent

## Project Overview

**ptw_agent** is an AI-powered assistant designed to support a digital **Permit to Work (PTW)** system. It provides backend services built with **Express.js**, handling work permit-related queries and simulating intelligent responses. The project is modular and ready for integration with AI models like Gemini 2.0 Flash.

---

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

---
```
## Project Structure

ptw_agent/
├── agent.js
├── dummy.js
├── functions.js
├── index.js
├── package.json
├── package-lock.json
├── routes/
│ └── chat.js
├── vercel.json
└── .gitignore 

```


---

## Setup & Installation

1. **Clone the repository:**

bash
git clone https://github.com/kalesha58/ptw_agent.git
cd ptw_agent

```bash
npm install

node index.js

```

The server will start on http://localhost:3000. You can test your endpoints using Postman, curl, or any API client.

## 🚀 Deploying a Node.js Express Application to Vercel

This guide will walk you through the process of deploying your Node.js Express application to Vercel as a serverless function.

---

### 📁 Project Structure

Ensure your project follows this structure:

```
/backend
├── api/
│   └── index.js
├── dummy.js
├── routes/
│   └── chat.js
├── package.json
└── vercel.json
```

**Important:** Place your main Express server file (`index.js`) inside the `api/` directory. Ensure all route handlers and related modules are properly imported within your `index.js` or other files.

---

### 🛠️ Setting Up `vercel.json`

Create a `vercel.json` file in the root of your project to configure Vercel's deployment behavior:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

The builds section tells Vercel to use the Node.js runtime for your serverless function, with api/index.js as the entry point.

The routes section rewrites all incoming requests to your Express app, ensuring all traffic is directed to your api/index.js serverless function.

### 📦 Installing Dependencies

Ensure all necessary dependencies are listed in your package.json:

```json
{
  "name": "ptw_agent",
  "version": "1.0.0",
  "main": "api/index.js",
  "scripts": {
    "start": "node api/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2"
  }
}
```

Install the dependencies:

```bash
npm install
```

### 🚀 Deploying to Vercel

Install Vercel CLI:

```bash
npm install -g vercel
```

Login to Vercel:

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

Deploy the Application:

```bash
vercel
```

Follow the prompts to complete the deployment. This will typically ask for your project name and if you want to link it to an existing Vercel project.

### 🧪 Local Development

To test your application locally with Vercel's environment (serverless function emulation):

```bash
vercel dev
```

This command emulates the Vercel deployment environment on your local machine, allowing you to test your serverless function before deploying.

### 🐞 Common Issues

**Issue:** Accessing the root URL (/) returns the contents of index.js instead of executing the server.

**Solution:** Ensure that your Express app is exported properly in api/index.js. Vercel expects your serverless function to export the Express application instance.

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

module.exports = app; // This line is crucial!
```

**Issue:** Receiving a 404 error after deployment.

**Solution:** Confirm that your vercel.json routes are correctly configured to direct all traffic to your Express app. Double-check the "src" and "dest" paths in the routes section to ensure they point to api/index.js.

### 📚 Additional Resources

- Using Express.js with Vercel
- Express 101: Deploying Express on Vercel

By following this guide, you should be able to deploy your Node.js Express application to Vercel successfully. Ensure that your project structure aligns with Vercel's expectations for serverless functions, and that your configuration files are correctly set up.
