# 🍴 What's Cookin'? 🍴️

## Abstract
What's Cookin'? is an interactive, web-based application that allows users to view a list of recipes they want to cook and plan their meals and shopping trips accordingly. Using HTML, CSS, JavaScript, and APIs, we built our app to allow users to view recipes, including step-by-step cooking instructions, ingredients list, and estimated total cost; filter recipes by tag or by name; save recipes to cook; manage ingredients in their pantry; view a customized shopping list by recipe based upon their pantry; and update their pantry with a single click when recipe has been cooked. 

## Preview of Application
### Search Functionality
![Search feature gif](https://media.giphy.com/media/RoEGoo8vNhpwDRlaJV/giphy.gif)
### Filter Functionality
![Filter feature gif](https://media.giphy.com/media/iwT2GfYsmg78MQN8Py/giphy.gif)
### Save Recipe Functionality
![Save Recipe gif](https://media.giphy.com/media/t45tqOWXPQBsPGWULl/giphy.gif)
### Add to Pantry and Cook Recipe Functionality
![Filter feature gif](https://media.giphy.com/media/pBaKSwHqVe9QmXOgg6/giphy.gif)

## Installation Instructions
1. This website fetches data from an API, so you will need to clone down and run `git clone github@github.com:turingschool/What-s-cookin--starter-kit-API.git`.
2. `CD` into that directory, run `npm install`, and then `npm start`. You should see "What's cookin-starter-kit API so now running at http://localhost:3001/".
3. In a NEW terminal tab, `CD` to a directory outside of the API directory you cloned down to perform the subsequent steps. Do not close the terminal tab running the API.
3. In your new terminal tab, clone [this repo](https://github.com/Eleanorgruth/whats-cookin) to your local computer.
4. `CD` into that directory, run `npm install`, and then `npm start`. You should see "Project is now running at http://localhost:8080/"
5. Copy and paste the link that appears in your terminal in your browser.
6. `Control + C` is the command to stop running the local server. Closing the terminal without stopping the server first could allow the server to continue to run in the background and cause problems.

## Context
What's Cookin'? is a two-part group project that is completed during Weeks 9 and 11 at Turing School of Software Development and Design. We worked as a team of four, implementing mob coding, driver-navigator paired coding, and independent coding. Part 1 took us approximately 60 hours to complete, and Part 2 took us approximately 50 hours for a total of approximately 110 hours. We used a thorough DTR, calendaring, and an Agile/Scrum Workflow to communicate while balancing project work with our full-time coursework and working across multiple time zones. [What's Cookin'? Project Spec Part 1](https://frontend.turing.edu/projects/whats-cookin-part-one.html) | [What's Cookin'? Project Spec Part 2](https://frontend.turing.edu/projects/whats-cookin-part-two.html)

## Contributors
- Lauren Frazier [GitHub](https://github.com/FrazierLE) | [LinkedIn](https://www.linkedin.com/in/lauren-frazier-745053188/)
- Keyaanna (Kiko) Pausch [GitHub](https://github.com/knpausch) | [LinkedIn](https://www.linkedin.com/in/knpausch/)
- Eleanor Ruth [GitHub](https://github.com/Eleanorgruth) | [LinkedIn](https://www.linkedin.com/in/eleanorgruth/)
- Jennifer Yacoubian [GitHub](https://github.com/jmyacobn) | [LinkedIn](https://www.linkedin.com/in/jennifer-yacoubian/)

## Learning Goals 🎯
- Implement ES6 classes that communicate to each other as needed
- **Use object and array prototype methods to perform data manipulation**
- Create a user interface that is easy to use and clearly displays information.
- Write modular, reusable code that follows SRP (Single Responsibility Principle)
- **Implement a robust testing suite using TDD**
- **Make network requests to retrieve data**

## Technology Used 💻
HTML | CSS | JavaScript | Figma | Webpack | API | Mocha and Chai | Chrome Dev Tools | GitHub Project Board | Lighthouse Accessibility Audit

## Wins 🏆
- Built a fully functional web application to meet the MVP outlined in the project spec 
- Building a web application that is fully tabbable, includes tab focus to improve the user experience, and passes the Lighthouse Accessibility Audit at 100%
- Successfully learned and implemented API fetch calls
- Highly successful team collaboration due thorough DTR, calendaring, and Agile/Scrum Workflow
- Learned to use Figma to design our website and GitHub Projects to manage our work as a team

## Challenges 😅
- Deleting recipes from our saved recipe view with a double click, while using a single click to view recipe details
- Initially, accessing the data in our fetch calls
- Initially, working with three nested data sets that contain different pieces of information that we needed to display to the DOM
- Initially, incorporating focus ring on non-interactive HTML elements for accessbility control

## Future Features
- Allow users to select multiple tags on both the home and saved recipe views
- Allow users to customize the recipe details by choosing a serving size
- Update the users pantry for them with the click of a button once they have all ingredients or create a checklist that they click to update as they acquire missing ingredients
- Allow users to rate recipes and leave comments
