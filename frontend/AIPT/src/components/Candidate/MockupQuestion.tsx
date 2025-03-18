import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const allQuestions: Question[] = [
  { id: 1, text: "What is React?", options: ["React is a JavaScript library for building user interfaces.", "React is a CSS framework.", "React is a programming language.", "React is a database."], correctAnswer: "React is a JavaScript library for building user interfaces." },
  { id: 2, text: "What are React components?", options: ["React components are reusable pieces of UI.", "React components are database schemas.", "React components are stylesheets.", "React components are browser APIs."], correctAnswer: "React components are reusable pieces of UI." },
  { id: 3, text: "What is JSX?", options: ["JSX is a syntax extension for JavaScript.", "JSX is a library.", "JSX is a backend framework.", "JSX is a CSS property."], correctAnswer: "JSX is a syntax extension for JavaScript." },
  { id: 4, text: "What are React hooks?", options: ["React hooks are functions that let you use state and lifecycle features in function components.", "React hooks are database queries.", "React hooks are styling methods.", "React hooks are JavaScript frameworks."], correctAnswer: "React hooks are functions that let you use state and lifecycle features in function components." },
  { id: 5, text: "Explain useState in React.", options: ["useState is a hook that lets you add state to function components.", "useState is a CSS property.", "useState is a JavaScript library.", "useState is a testing framework."], correctAnswer: "useState is a hook that lets you add state to function components." },
  { id: 6, text: "Explain useEffect in React.", options: ["useEffect is a hook for performing side effects in function components.", "useEffect is a styling method.", "useEffect is a database query tool.", "useEffect is a browser API."], correctAnswer: "useEffect is a hook for performing side effects in function components." },
  { id: 7, text: "What is React Router?", options: ["React Router is a library for managing navigation and routing in React applications.", "React Router is a backend framework.", "React Router is a state management tool.", "React Router is a CSS preprocessor."], correctAnswer: "React Router is a library for managing navigation and routing in React applications." },
  { id: 8, text: "What is Redux?", options: ["Redux is a state management library.", "Redux is a CSS framework.", "Redux is a testing tool.", "Redux is a database system."], correctAnswer: "Redux is a state management library." },
  { id: 9, text: "What is the Virtual DOM?", options: ["A lightweight copy of the real DOM.", "A type of JavaScript function.", "A database structure.", "A browser extension."], correctAnswer: "A lightweight copy of the real DOM." },
  { id: 10, text: "What is the purpose of props?", options: ["To pass data between components.", "To store local state.", "To connect to databases.", "To style components."], correctAnswer: "To pass data between components." },
  { id: 11, text: "What is Next.js?", options: ["A React framework for server-side rendering.", "A database system.", "A UI component library.", "A mobile development platform."], correctAnswer: "A React framework for server-side rendering." },
  { id: 12, text: "What is Tailwind CSS?", options: ["A utility-first CSS framework.", "A JavaScript library.", "A type of React hook.", "A database solution."], correctAnswer: "A utility-first CSS framework." },
  { id: 13, text: "What is TypeScript?", options: ["A strongly typed superset of JavaScript.", "A frontend framework.", "A database query language.", "A testing library."], correctAnswer: "A strongly typed superset of JavaScript." },
  { id: 14, text: "What is API in React?", options: ["A set of functions for data fetching.", "A CSS property.", "A JavaScript engine.", "A database management system."], correctAnswer: "A set of functions for data fetching." },
  { id: 15, text: "What is Firebase?", options: ["A cloud-based backend solution.", "A frontend library.", "A CSS framework.", "A version control system."], correctAnswer: "A cloud-based backend solution." },
  { id: 16, text: "What is the purpose of React's key prop?", options: ["To help React identify which items have changed, are added, or are removed.", "To define a component's unique identity.", "To style components uniquely.", "To store data within a component."], correctAnswer: "To help React identify which items have changed, are added, or are removed." },
  { id: 17, text: "What is the difference between a class component and a functional component in React?", options: ["Class components have lifecycle methods, while functional components use hooks.", "Functional components are slower than class components.", "Class components can only have state.", "Functional components cannot accept props."], correctAnswer: "Class components have lifecycle methods, while functional components use hooks." },
  { id: 18, text: "What is the useContext hook used for?", options: ["To share state between components.", "To handle side effects in functional components.", "To modify the DOM directly.", "To add styling to a component."], correctAnswer: "To share state between components." },
  { id: 19, text: "Which of the following is a benefit of using Redux in a React app?", options: ["Global state management.", "Improved component styling.", "Better routing capabilities.", "Faster rendering of components."], correctAnswer: "Global state management." },
  { id: 20, text: "What is a React component lifecycle?", options: ["The series of methods a component goes through from creation to destruction.", "The process of adding styles to a component.", "The process of managing props in a component.", "The way React interacts with the Virtual DOM."], correctAnswer: "The series of methods a component goes through from creation to destruction." },
  { id: 21, text: "What is the purpose of React's render() method?", options: ["To return JSX to be displayed in the UI.", "To manage component state.", "To handle user inputs.", "To perform side effects."], correctAnswer: "To return JSX to be displayed in the UI." },
  { id: 22, text: "What is the purpose of React.memo?", options: ["To memoize a component to prevent unnecessary re-renders.", "To handle side effects.", "To update the component state.", "To style components dynamically."], correctAnswer: "To memoize a component to prevent unnecessary re-renders." },
  { id: 23, text: "What is the purpose of the useReducer hook?", options: ["To manage more complex state logic in functional components.", "To manage lifecycle methods in functional components.", "To manage routing in React.", "To handle side effects."], correctAnswer: "To manage more complex state logic in functional components." },
  { id: 24, text: "What does the useRef hook return?", options: ["A mutable object that persists for the lifetime of the component.", "A component's props.", "A style object for the component.", "A function to trigger a re-render."], correctAnswer: "A mutable object that persists for the lifetime of the component." },
  { id: 25, text: "What is the role of Webpack in React applications?", options: ["To bundle JavaScript files and other assets.", "To manage component state.", "To handle HTTP requests.", "To add animations to a page."], correctAnswer: "To bundle JavaScript files and other assets." },
  { id: 26, text: "What is the purpose of React.StrictMode?", options: ["To highlight potential problems in an application.", "To render components faster.", "To handle state changes.", "To provide styling to components."], correctAnswer: "To highlight potential problems in an application." },
  { id: 27, text: "What does the useLayoutEffect hook do?", options: ["It is like useEffect but it runs synchronously after all DOM mutations.", "It handles user input.", "It manages component state.", "It changes the styles of a component."], correctAnswer: "It is like useEffect but it runs synchronously after all DOM mutations." },
  { id: 28, text: "What is the difference between useState and useReducer?", options: ["useState is for simple state, useReducer is for more complex state logic.", "useState handles side effects, useReducer doesn't.", "useState is used for routing, useReducer is used for component rendering.", "useState is for styling components."], correctAnswer: "useState is for simple state, useReducer is for more complex state logic." },
  { id: 29, text: "What does the componentDidMount lifecycle method do in class components?", options: ["It is called once after the component is mounted to the DOM.", "It handles state updates.", "It is used to define props.", "It is used to delete a component."], correctAnswer: "It is called once after the component is mounted to the DOM." },
  { id: 30, text: "What is the purpose of version control in software development?", options: ["To track changes to the source code.", "To manage the hardware infrastructure.", "To design the user interface.", "To write unit tests."], correctAnswer: "To track changes to the source code." },
  { id: 31, text: "What is Agile methodology?", options: ["A project management methodology emphasizing iterative development.", "A database management technique.", "A security framework.", "A software architecture pattern."], correctAnswer: "A project management methodology emphasizing iterative development." },
  { id: 32, text: "What is a unit test?", options: ["A test that checks individual units of source code for correctness.", "A test that checks the whole system's performance.", "A security test.", "A method for UI testing."], correctAnswer: "A test that checks individual units of source code for correctness." },
  { id: 33, text: "What is the purpose of a code review?", options: ["To improve code quality by having others check it.", "To measure code performance.", "To optimize UI design.", "To deploy code to production."], correctAnswer: "To improve code quality by having others check it." },
  { id: 34, text: "What is a pull request?", options: ["A request to merge code changes into a main branch.", "A request to deploy code.", "A request to design a new UI.", "A request for cybersecurity audit."], correctAnswer: "A request to merge code changes into a main branch." },
  { id: 35, text: "What does a REST API stand for?", options: ["Representational State Transfer Application Programming Interface.", "Remote System Test Application Programming Interface.", "Rapid Service Task Application Programming Interface.", "Regular System Test Application Programming Interface."], correctAnswer: "Representational State Transfer Application Programming Interface." },
  { id: 36, text: "What is the purpose of continuous integration (CI) in DevOps?", options: ["To automatically integrate code changes into a shared repository.", "To manage database schemas.", "To create UI prototypes.", "To handle user authentication."], correctAnswer: "To automatically integrate code changes into a shared repository." },
  { id: 37, text: "What is a wireframe?", options: ["A low-fidelity visual representation of a website or app's layout.", "A code structure for managing databases.", "A component for UI state management.", "A test for software security."], correctAnswer: "A low-fidelity visual representation of a website or app's layout." },
  { id: 38, text: "What is an HTTP request?", options: ["A request sent by a client to a server to retrieve or send data.", "A request to deploy code to a server.", "A request to change the design of a page.", "A request to start a cybersecurity attack."], correctAnswer: "A request sent by a client to a server to retrieve or send data." },
  { id: 39, text: "What is a DNS server?", options: ["A server that translates domain names into IP addresses.", "A server that manages database queries.", "A server that manages authentication requests.", "A server that stores backup data."], correctAnswer: "A server that translates domain names into IP addresses." },
  { id: 40, text: "What is OAuth?", options: ["An authorization framework for secure user authentication.", "An encryption method for database security.", "A tool for writing test cases.", "A programming language."], correctAnswer: "An authorization framework for secure user authentication." },
  { id: 41, text: "What is the purpose of an IDE (Integrated Development Environment)?", options: ["To provide developers with a set of tools to write, test, and debug code.", "To deploy software to production.", "To design user interfaces.", "To perform security analysis."], correctAnswer: "To provide developers with a set of tools to write, test, and debug code." },
  { id: 42, text: "What is a bug in software development?", options: ["A flaw or error in the code that causes incorrect behavior.", "A feature of the UI design.", "A security vulnerability.", "A performance optimization."], correctAnswer: "A flaw or error in the code that causes incorrect behavior." },
  { id: 43, text: "What is the difference between an abstract class and an interface in object-oriented programming?", options: ["An abstract class can have method implementations, while an interface cannot.", "An interface can have method implementations, while an abstract class cannot.", "An abstract class is used for database connections, while an interface is used for UI components.", "There is no difference."], correctAnswer: "An abstract class can have method implementations, while an interface cannot." },
  { id: 44, text: "What is penetration testing?", options: ["Simulated cyberattacks on a system to identify vulnerabilities.", "A method of writing test cases.", "A process of debugging code.", "A way to design user interfaces."], correctAnswer: "Simulated cyberattacks on a system to identify vulnerabilities." },
  { id: 45, text: "What is a security vulnerability?", options: ["A weakness in a system that can be exploited by attackers.", "A performance issue in the application.", "A user interface bug.", "A database connection issue."], correctAnswer: "A weakness in a system that can be exploited by attackers." },
  { id: 46, text: "What is a continuous delivery pipeline?", options: ["A set of automated processes to deploy code to production.", "A method for designing UI components.", "A security audit process.", "A method for testing software."], correctAnswer: "A set of automated processes to deploy code to production." },
  { id: 47, text: "What is cross-site scripting (XSS) in web security?", options: ["A security vulnerability where malicious scripts are injected into webpages.", "A performance optimization technique.", "A method of encrypting passwords.", "A way to style web pages."], correctAnswer: "A security vulnerability where malicious scripts are injected into webpages." },
  { id: 48, text: "What is the purpose of a load balancer?", options: ["To distribute incoming network traffic across multiple servers.", "To encrypt communication between the client and server.", "To manage database queries.", "To handle user input on the frontend."], correctAnswer: "To distribute incoming network traffic across multiple servers." },
  { id: 49, text: "What is a container in DevOps?", options: ["A lightweight, portable environment for running software.", "A testing tool for user interfaces.", "A software for building databases.", "A framework for writing code."], correctAnswer: "A lightweight, portable environment for running software." },
  { id: 50, text: "What is SQL injection?", options: ["A type of attack where malicious SQL queries are inserted into an application.", "A method of testing UI components.", "A performance optimization technique.", "A method for managing database connections."], correctAnswer: "A type of attack where malicious SQL queries are inserted into an application." },
  { id: 51, text: "What is a user story in Agile development?", options: ["A short description of a feature from the perspective of the user.", "A method of testing features.", "A diagram representing the software architecture.", "A type of user interface design."], correctAnswer: "A short description of a feature from the perspective of the user." },
  { id: 52, text: "What is the purpose of a design pattern?", options: ["To provide reusable solutions to common design problems.", "To encrypt data.", "To optimize code performance.", "To create database schemas."], correctAnswer: "To provide reusable solutions to common design problems." },
  { id: 53, text: "What is a mockup in UI design?", options: ["A visual representation of a product, often low-fidelity.", "A prototype of the final product.", "A security feature for protecting data.", "A method of testing code."], correctAnswer: "A visual representation of a product, often low-fidelity." },
  { id: 54, text: "What is a CI/CD pipeline?", options: ["A set of practices to automate code integration and deployment.", "A tool for designing UI components.", "A technique for managing software databases.", "A method of testing security vulnerabilities."], correctAnswer: "A set of practices to automate code integration and deployment." },
  { id: 55, text: "What is the role of a UX designer?", options: ["To design the overall experience and usability of a product.", "To write code for the frontend.", "To manage security vulnerabilities.", "To optimize the performance of an application."], correctAnswer: "To design the overall experience and usability of a product." },
  { id: 56, text: "What is two-factor authentication?", options: ["A security process that requires two forms of identification to access an account.", "A performance optimization method.", "A UI design technique.", "A method for managing database connections."], correctAnswer: "A security process that requires two forms of identification to access an account." },
  { id: 57, text: "What is the purpose of a database index?", options: ["To improve the speed of data retrieval operations.", "To secure sensitive data.", "To optimize UI layout.", "To monitor server performance."], correctAnswer: "To improve the speed of data retrieval operations." },
  { id: 58, text: "What is a RESTful API?", options: ["An API that follows the principles of REST architecture for web services.", "A method of UI testing.", "A tool for performance optimization.", "A way to manage database backups."], correctAnswer: "An API that follows the principles of REST architecture for web services." },
  { id: 59, text: "What is a proxy server?", options: ["A server that acts as an intermediary between a client and another server.", "A software tool for UI design.", "A method of encrypting communication.", "A tool for unit testing."], correctAnswer: "A server that acts as an intermediary between a client and another server." },
  { id: 60, text: "What is cross-origin resource sharing (CORS)?", options: ["A security feature that allows or restricts resources to be requested from a different domain.", "A method for managing session cookies.", "A tool for testing UI components.", "A technique for writing secure code."], correctAnswer: "A security feature that allows or restricts resources to be requested from a different domain." },
  { id: 61, text: "What is an authentication token?", options: ["A piece of data used to verify the identity of a user.", "A method of caching data.", "A framework for building user interfaces.", "A tool for managing security vulnerabilities."], correctAnswer: "A piece of data used to verify the identity of a user." },
  { id: 62, text: "What is Git?", options: ["A version control system for tracking changes in source code.", "A framework for building user interfaces.", "A tool for writing test cases.", "A security protocol."], correctAnswer: "A version control system for tracking changes in source code." },
  { id: 63, text: "What is an access control list (ACL)?", options: ["A list of permissions associated with network resources.", "A UI design tool.", "A method for encrypting data.", "A server management tool."], correctAnswer: "A list of permissions associated with network resources." },
  { id: 64, text: "What is the role of a DevOps engineer?", options: ["To manage the software development lifecycle and automate processes.", "To design user interfaces.", "To handle security vulnerabilities.", "To write unit tests."], correctAnswer: "To manage the software development lifecycle and automate processes." },
  { id: 65, text: "What is a digital signature?", options: ["A cryptographic method used to verify the authenticity and integrity of data.", "A method of optimizing performance.", "A way to design UI components.", "A tool for database management."], correctAnswer: "A cryptographic method used to verify the authenticity and integrity of data." },
  { id: 66, text: "What is a vulnerability scan?", options: ["A process that automatically checks a system for security weaknesses.", "A method of debugging code.", "A way to design user interfaces.", "A tool for managing databases."], correctAnswer: "A process that automatically checks a system for security weaknesses." },
  { id: 67, text: "What is a data breach?", options: ["Unauthorized access to sensitive data.", "A method of optimizing the UI layout.", "A way to handle user authentication.", "A tool for writing test cases."], correctAnswer: "Unauthorized access to sensitive data." },
  { id: 68, text: "What is a mock API?", options: ["An API used for simulating responses from a real backend system.", "A method of testing UI components.", "A database optimization technique.", "A tool for encrypting data."], correctAnswer: "An API used for simulating responses from a real backend system." },
  { id: 69, text: "What is encryption?", options: ["The process of encoding data to protect it from unauthorized access.", "A method of debugging code.", "A technique for optimizing user interfaces.", "A way to manage databases."], correctAnswer: "The process of encoding data to protect it from unauthorized access." },
  { id: 70, text: "What is a session in web development?", options: ["A mechanism to store data for a user across multiple requests.", "A method of securing passwords.", "A process of optimizing database queries.", "A technique for writing unit tests."], correctAnswer: "A mechanism to store data for a user across multiple requests." },
  { id: 71, text: "What is a static website?", options: ["A website with fixed content that doesn't change based on user interaction.", "A website that updates content dynamically.", "A website designed using AI tools.", "A website built with a CMS."], correctAnswer: "A website with fixed content that doesn't change based on user interaction." },
  { id: 72, text: "What is the role of a software architect?", options: ["To design the high-level structure of software systems.", "To manage databases.", "To write code for user interfaces.", "To monitor network traffic."], correctAnswer: "To design the high-level structure of software systems." },
  { id: 73, text: "What is an ORM (Object-Relational Mapping)?", options: ["A technique for converting data between incompatible type systems.", "A framework for managing UI components.", "A method for securing network traffic.", "A tool for writing test cases."], correctAnswer: "A technique for converting data between incompatible type systems." },
  { id: 74, text: "What is API rate limiting?", options: ["A process to control the number of requests a client can make to an API in a given time.", "A method of optimizing UI components.", "A tool for managing databases.", "A way to handle user input."], correctAnswer: "A process to control the number of requests a client can make to an API in a given time." },
  { id: 75, text: "What is SQL?", options: ["Structured Query Language used for managing relational databases.", "A programming language for frontend development.", "A tool for testing security vulnerabilities.", "A method for creating UI designs."], correctAnswer: "Structured Query Language used for managing relational databases." },
  { id: 76, text: "What is an endpoint in API development?", options: ["A URL where an API can be accessed by a client.", "A method of securing web applications.", "A UI component in web design.", "A process of optimizing server performance."], correctAnswer: "A URL where an API can be accessed by a client." },
  { id: 77, text: "What is OAuth 2.0?", options: ["An authorization framework that allows third-party services to exchange web resources on behalf of a user.", "A method of encrypting data.", "A system for managing user sessions.", "A tool for building web pages."], correctAnswer: "An authorization framework that allows third-party services to exchange web resources on behalf of a user." },
  { id: 78, text: "What is containerization?", options: ["A method of packaging software in a way that it can run consistently across different computing environments.", "A tool for designing UI layouts.", "A technique for managing databases.", "A method for optimizing web performance."], correctAnswer: "A method of packaging software in a way that it can run consistently across different computing environments." },
  { id: 79, text: "What is a microservice architecture?", options: ["An architecture style that structures an application as a collection of small, loosely coupled services.", "A tool for frontend development.", "A method for optimizing SQL queries.", "A process for managing security policies."], correctAnswer: "An architecture style that structures an application as a collection of small, loosely coupled services." },
  { id: 80, text: "What is a distributed system?", options: ["A system where components located on networked computers communicate and coordinate their actions to achieve a common goal.", "A method of designing user interfaces.", "A security testing framework.", "A type of database architecture."], correctAnswer: "A system where components located on networked computers communicate and coordinate their actions to achieve a common goal." },
  { id: 81, text: "What is a VPN?", options: ["A Virtual Private Network that extends a private network across a public network.", "A type of web server.", "A security vulnerability scanner.", "A method for designing mobile applications."], correctAnswer: "A Virtual Private Network that extends a private network across a public network." },
  { id: 82, text: "What is a software deployment?", options: ["The process of releasing a software application to a production environment.", "A method of testing UI components.", "A way to secure network traffic.", "A technique for optimizing database performance."], correctAnswer: "The process of releasing a software application to a production environment." },
  { id: 83, text: "What is an agile sprint?", options: ["A short, time-boxed period during which a team works to complete a set of tasks.", "A tool for testing security features.", "A type of software deployment strategy.", "A method of optimizing UI layouts."], correctAnswer: "A short, time-boxed period during which a team works to complete a set of tasks." },
  { id: 84, text: "What is cross-site request forgery (CSRF)?", options: ["A security vulnerability where unauthorized commands are sent from a user that the web application trusts.", "A technique for testing web UI.", "A process for managing user authentication.", "A method of optimizing backend performance."], correctAnswer: "A security vulnerability where unauthorized commands are sent from a user that the web application trusts." },
  { id: 85, text: "What is the difference between HTTP and HTTPS?", options: ["HTTPS is HTTP with encryption for secure communication.", "HTTP is used for web page layout, while HTTPS is for backend communication.", "HTTP is used for API requests, while HTTPS is used for UI interactions.", "There is no difference."], correctAnswer: "HTTPS is HTTP with encryption for secure communication." },
  { id: 86, text: "What is an API gateway?", options: ["A server that acts as an API front-end, routing requests to the appropriate backend services.", "A tool for securing user authentication.", "A method for optimizing SQL queries.", "A frontend component for web applications."], correctAnswer: "A server that acts as an API front-end, routing requests to the appropriate backend services." },
  { id: 87, text: "What is a code freeze?", options: ["A period of time during which no code changes are allowed in the project.", "A process for optimizing UI components.", "A method for testing API endpoints.", "A technique for handling security vulnerabilities."], correctAnswer: "A period of time during which no code changes are allowed in the project." },
  { id: 88, text: "What is a sandbox environment?", options: ["An isolated testing environment used to run untrusted code or experiments.", "A security feature for protecting databases.", "A tool for designing front-end interfaces.", "A method for managing network traffic."], correctAnswer: "An isolated testing environment used to run untrusted code or experiments." },
  { id: 89, text: "What is a service-oriented architecture (SOA)?", options: ["An architectural pattern where software components provide services to other components over a network.", "A tool for designing responsive UI.", "A method for writing secure code.", "A testing framework for user authentication."], correctAnswer: "An architectural pattern where software components provide services to other components over a network." },
  { id: 90, text: "What is the purpose of a firewall?", options: ["To monitor and control incoming and outgoing network traffic based on security rules.", "To optimize database queries.", "To manage front-end interactions.", "To monitor server performance."], correctAnswer: "To monitor and control incoming and outgoing network traffic based on security rules." },
  { id: 91, text: "What is code refactoring?", options: ["The process of restructuring existing code without changing its external behavior.", "A method for testing backend systems.", "A tool for UI design.", "A process for debugging security issues."], correctAnswer: "The process of restructuring existing code without changing its external behavior." },
  { id: 92, text: "What is a hotfix?", options: ["A quick, immediate fix to a software bug in a production environment.", "A method of writing test cases.", "A security vulnerability fix.", "A process for designing UI components."], correctAnswer: "A quick, immediate fix to a software bug in a production environment." },
  { id: 93, text: "What is a monolithic architecture?", options: ["An architecture style where all components of an application are combined into a single, unified codebase.", "A method of optimizing databases.", "A tool for designing frontend UI.", "A process for managing user sessions."], correctAnswer: "An architecture style where all components of an application are combined into a single, unified codebase." },
  { id: 94, text: "What is DevOps?", options: ["A set of practices that combine software development and IT operations.", "A tool for frontend development.", "A process for testing security vulnerabilities.", "A method for optimizing SQL queries."], correctAnswer: "A set of practices that combine software development and IT operations." },
  { id: 95, text: "What is a database transaction?", options: ["A logical unit of work that contains one or more database operations.", "A UI component for data input.", "A method for testing API endpoints.", "A security protocol for data encryption."], correctAnswer: "A logical unit of work that contains one or more database operations." },
  { id: 96, text: "What is serverless computing?", options: ["A cloud computing execution model where the cloud provider manages the infrastructure.", "A method for developing offline applications.", "A technique for optimizing database queries.", "A framework for frontend development."], correctAnswer: "A cloud computing execution model where the cloud provider manages the infrastructure." },
  { id: 97, text: "What is progressive web app (PWA)?", options: ["A web application that uses modern web capabilities to deliver an app-like experience.", "A backend database solution.", "A method for encrypting user data.", "A tool for testing mobile applications."], correctAnswer: "A web application that uses modern web capabilities to deliver an app-like experience." },
  { id: 98, text: "What is the purpose of HTTPS?", options: ["To provide secure communication over a computer network.", "To optimize website loading speed.", "To manage database connections.", "To design responsive UI layouts."], correctAnswer: "To provide secure communication over a computer network." },
  { id: 99, text: "What is the role of a QA (Quality Assurance) engineer?", options: ["To ensure that software meets quality standards before release.", "To design user interfaces.", "To develop backend systems.", "To manage network infrastructure."], correctAnswer: "To ensure that software meets quality standards before release." },
  { id: 100, text: "What is cloud computing?", options: ["The delivery of computing services over the internet.", "A method for testing UI components.", "A technique for optimizing database queries.", "A framework for designing mobile applications."], correctAnswer: "The delivery of computing services over the internet." }
];

const MockupQuestion: React.FC<{ onEndTest: (score: number) => void }> = ({ onEndTest }) => {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number>(0);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [shuffledOptions, setShuffledOptions] = useState<{ [key: number]: string[] }>({});

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // Select 10 random questions
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffledQuestions);
    
    // Create shuffled options for each question
    const initialShuffledOptions: { [key: number]: string[] } = {};
    shuffledQuestions.forEach(question => {
      initialShuffledOptions[question.id] = shuffleArray(question.options);
    });
    setShuffledOptions(initialShuffledOptions);

    // Set timeout for end button visibility
    setTimeout(() => {
      setIsButtonVisible(true);
    }, 30000);
  }, []);

  const handleOptionSelect = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: option };
      return updatedAnswers;
    });
  };

  const handleNextQuestion = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const correctAnswer = currentQuestion.correctAnswer;

    // If the answer is correct, add 1 to the score
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => Math.min(prevScore + 1, quizQuestions.length));
    }

    // Move to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    
    // Reset visibility timer if not on last question
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setIsButtonVisible(false);
      setTimeout(() => {
        setIsButtonVisible(true);
      }, 30000);
    }
  };

  const handleFinishTest = () => {
    onEndTest(score);
  };

  // Handle the case where quiz questions haven't loaded yet
  if (quizQuestions.length === 0) {
    return <div className="text-center p-4">Loading questions...</div>;
  }

  return (
    <div className="mockup-container p-4 bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg shadow-lg">
      {currentQuestionIndex < quizQuestions.length ? (
        <div className="question-box bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Question {currentQuestionIndex + 1}</h2>
          <p className="text-lg text-gray-700">{quizQuestions[currentQuestionIndex].text}</p>
          <div className="options mt-4">
            {shuffledOptions[quizQuestions[currentQuestionIndex].id] && 
             shuffledOptions[quizQuestions[currentQuestionIndex].id].map((option, index) => (
              <div key={index} className="option mb-2">
                <label className="block text-gray-800">
                  <input
                    type="radio"
                    name={`question-${quizQuestions[currentQuestionIndex].id}`}
                    value={option}
                    checked={selectedAnswers[quizQuestions[currentQuestionIndex].id] === option}
                    onChange={() => handleOptionSelect(quizQuestions[currentQuestionIndex].id, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <button 
            onClick={handleNextQuestion} 
            disabled={!selectedAnswers[quizQuestions[currentQuestionIndex].id]}
            className={`mt-4 py-2 px-4 ${
              selectedAnswers[quizQuestions[currentQuestionIndex].id] 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-blue-300 cursor-not-allowed"
            } text-white rounded-lg transition duration-300`}
          >
            Next
          </button>
        </div>
      ) : (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-green-500">Test Finished!</h2>
          <p className="text-xl mt-2">Your score: {score} / 10</p>
          {isButtonVisible && (
            <button onClick={handleFinishTest} className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
              End Test
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MockupQuestion;