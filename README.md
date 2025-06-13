# Coding-dashboard
My Coding Guide A personal web-based guide designed to help computer science students and developers organize their learning resources, documentation links, practice websites, and project ideas across various programming languages and Machine Learning/AI domains. This application features a clean, tabbed interface and persists all data locally in your browser.

✨ Features Multi-Tab Navigation: Organize content across main categories:

Programming Languages

Practice Websites

ML & AI

Projects

Additional Resources

Nested Sub-Tabs:

Programming Languages includes sub-tabs for: Python, JavaScript, Java, CSS, HTML, React, C++.

ML & AI includes sub-tabs for: General Concepts, TensorFlow, PyTorch, Scikit-learn, Computer Vision.

Resource Management (CRUD):

Add: Easily add new documentation links, notes, or website URLs.

Edit: Modify existing resource entries.

Delete: Remove resources you no longer need.

Local Data Persistence: All your added resources are saved directly in your browser's localStorage, meaning your data will remain even if you close and reopen the browser.

Intuitive UI: A clean and user-friendly interface with clear navigation and forms.

Responsive Design: Optimized for viewing and interaction across various device sizes (desktop, tablet, mobile).

🚀 Technologies Used React.js: A JavaScript library for building user interfaces.

JavaScript (ES6+): For application logic and interactivity.

HTML5: For the application's structure.

CSS3: For styling and responsive design.

Local Storage API: For client-side data persistence.

📦 Getting Started Follow these steps to get a copy of the project up and running on your local machine.

Prerequisites Node.js (LTS version recommended)

npm (comes with Node.js) or Yarn

Installation Clone the repository (or create a new React app): If you're starting from scratch, create a new React app:

npx create-react-app my-coding-guide cd my-coding-guide

Then, replace the src/App.js and src/App.css files with the code provided.

Install dependencies:

npm install

or
yarn install

Run the application:

npm start

or
yarn start

This will open the application in your browser at http://localhost:3000.

💡 Usage Navigate Tabs: Click on the main tabs (e.g., "Programming Languages", "ML & AI") to switch between major sections.

Explore Sub-Tabs: For "Programming Languages" and "ML & AI", click on the sub-tabs (e.g., "Python", "TensorFlow") to view resources specific to that category.

Add Resources:

Click the "Add New Resource" button.

Fill in the "Name", "Link (URL)", and "Notes" fields. For ML/AI tabs, you'll also see a "Category" field.

Click "Add Resource".

Edit Resources:

Locate the resource you wish to edit in the list.

Click the "Edit" button on the resource card.

Modify the fields in the form and click "Update Resource".

Delete Resources:

Locate the resource you wish to delete.

Click the "Delete" button on the resource card.

📂 Project Structure (Key Files) src/App.js: The main React component containing all the application logic, state management, and rendering of tabs and forms.

src/App.css: Contains all the custom CSS styles for the application's layout and appearance.

src/index.js: The entry point of the React application.

public/index.html: The main HTML file where the React app is mounted.

🚀 Future Enhancements Search Functionality: Add a search bar to quickly find resources across all categories.

Tagging System: Implement a more flexible tagging system for resources beyond just categories.

User Accounts/Cloud Storage: Integrate with a backend (e.g., Firebase, Supabase) to allow users to save their data in the cloud and access it from multiple devices.

Markdown Support: Allow notes to be written in Markdown for richer formatting.

Resource Prioritization/Rating: Add options to mark resources as favorites or rate their usefulness.

Offline Support: Implement Service Workers for better offline capabilities.# coding-guide

