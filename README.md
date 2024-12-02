# INTERVIEW-PROCESSING-SYSTEM

## Project Introduction

The Automated Interview Process Tool is designed to streamline the recruitment process for technical roles by assessing candidates' coding skills in a comprehensive and automated manner. It evaluates multiple aspects of the candidate's responses, such as the complexity, maintainability, and confidence of their code. By utilizing advanced metrics such as Cyclomatic Complexity (CC), Weighted Composite Complexity (WCC), and Cognitive Functional Size (CFC), the tool offers an objective measure of a candidate's ability to write clean, efficient, and maintainable code. This system is beneficial for both technical interviews and candidate shortlisting.

## Features

1. **Code Complexity Evaluation**: Assesses the complexity of a candidate's code using metrics such as Cyclomatic Complexity (CC), Weighted Composite Complexity (WCC), and Cognitive Functional Size (CFC). These metrics help in determining how intricate or simple the code is and its suitability for long-term maintenance.
   
2. **Code Maintainability Evaluation**: Measures how easy it is to maintain and modify the candidate’s code based on industry-standard metrics and best practices.
   
3. **Confidence and Personality Evaluation**: Analyzes the candidate's confidence level, tone, and pitch during the interview, helping to understand their communication style and assertiveness.

4. **Automated Scoring**: Automatically calculates scores for candidates based on their code complexity and maintainability, which can be used to shortlist candidates for further rounds of the interview.


## Architecture Diagram

![All](https://github.com/user-attachments/assets/9dd2f39c-ca51-4d94-b881-22296af6d507)

## Dependencies

The following dependencies are required to run this project:

### Frontend:
- **React**: JavaScript library for building the user interface.
- **Vite**: Build tool that provides fast and lean development for React projects.
- **axios**: For making API calls to the backend (Node.js/Flask).
- **React-Router**: For client-side routing in the React app.
- **Material-UI/TailwindCSS**: For styling the application and creating responsive components.
- **react-mic** or **react-audio-recorder**: For recording audio during the interview (can be swapped based on your preference).
- **JWT-Decode**: For decoding and validating the JWT token in the frontend.

#### Node.js Backend:
- **Express.js**: Web framework for Node.js to handle routing, middleware, and request handling.
- **Axios**: For making HTTP requests to external APIs (Flask services) and managing communication between microservices.
- **JWT (jsonwebtoken)**: For managing authentication and authorization via JSON Web Tokens.
- **dotenv**: For managing environment variables.
- **MongoDB (Mongoose)**: For database interactions (NoSQL) to store candidate responses, interview questions, and other interview-related data.
- **Nodemon**: For auto-reloading the server during development.

#### Python (Flask) Microservices:
- **Flask**: Micro web framework for Python used to build lightweight and flexible RESTful APIs.
- **Flask-SQLAlchemy**: For integrating SQL-based databases in the Flask service (if applicable).
- **Flask-Cors**: To enable Cross-Origin Resource Sharing (CORS) for communication between Node.js and Python microservices.
- **pydub**: For audio processing (to analyze audio recordings).
- **SpeechRecognition**: For transcribing audio to text from recorded responses.
- **pytorch/tensorflow**: For machine learning models to evaluate confidence, sentiment, and emotions.
- **OpenCV**: For processing video input (e.g., analyzing body language and posture during the interview).
- **flask-redis**: For caching data to optimize response times for repeated requests.


#### DevOps and Deployment:
- **Docker**: For containerizing microservices (Node.js and Flask services).
- **Docker Compose**: For defining and running multi-container Docker applications.
- **GitHub**: For continuous integration and deployment.

### Commit History 

- **Commit History**: To view the commit history with a visual graph, use the following command:
 View complete commit history on [GitHub](https://github.com/SLIIT-24-25J-047-Research/INTERVIEW-PROCESSING-SYSTEM/commits/main).

### Branches

The project has the following branches:

```bash
* main
* Development
* IT21319792-Boshitha_Gunarathna
* IT21319792-Boshitha_Gunarathna-Model_Train
* IT21319792-patch-1
* IT21158186-Deneth_Pinsara
* IT21158186-Deneth_Pinsara-Model_Train
* feature/Deneth
* IT21170966-Indudini_Thennakoon
* IT21170966-Indudini_Thennakon_model
* IT21167232-Shehela_Anjalie
* IT21167232-Shehela_Anjalie-Model_Train
```

## License

This project is licensed under the Creative Commons CC0 1.0 Universal License. 

### License Details

By using this license, you waive all your rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law. This means that you are free to use, copy, modify, and distribute the work for any purpose without any restrictions.

For more information, you can review the full license [here](https://creativecommons.org/publicdomain/zero/1.0/).


5. **Gamified Problem Solving**: Integrates gamified assessments to evaluate technical problem-solving skills and creativity under pressure.

6. **Video-Based Assessment**: Analyzes the candidate’s body language and video presentation to assess clarity, posture, and professional demeanor during the interview.

