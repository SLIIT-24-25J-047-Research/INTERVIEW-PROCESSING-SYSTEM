# INTERVIEW-PROCESSING-SYSTEM

## Project Introduction

The Automated Interview Process Tool is designed to streamline the recruitment process for technical roles by assessing candidates' professionalism and coding skills in a comprehensive and automated manner.This system is beneficial for both technical interviews and candidate shortlisting.

**Video-Based Evaluation:** Analyzes video-based responses, including mock tests and video based cover letters, to evaluate professionalism of the candidate. This function considers factors such as attire, clarity of communication, and overall presentation.based on these details candidate will be chosen for the interview process. Serveral Deep learning models will be used to identify these details.

**Confidence and Personality Evaluation:** In the Non-technical interview phase,  system analyzes the candidate's voice for tone, pitch, and frequency variations and patterns to assess confidence levels and other personality traits. This function helps gauge a candidate's ability to communicate effectively under pressure, ensuring a well-rounded evaluation. A deep learning model will be used to evaluate the confidence level. Also 2 Large language models will be used to identify the answers and compare them with the correct answer. 

**Emotional and Problem-Solving Assessment:** In the Technical interview phase,system utilizes emotional analysis combined with gamified assessments in a gamified environment to evaluate the candidate's technical skills and problem-solving capabilities. Candidate has to face the interview in a controled environment. System will analyze the candidate's facial and behavioral details to identify the stress levels and amotions. This feature offers a dynamic and engaging way to assess critical thinking and adaptability. A Deep learning model will be used to find these details. 

**Code Evaluation:** Assesses the quality of the candidate's code by analyzing its complexity, correctness, and maintainability. Cyclomatic Complexity (CC), Weighted Composite Complexity (WCC), and Cognitive Functional Size (CFC) will be used to get a single value about the maintainability and the complexity to objectively evaluate the candidate's ability to write clean, efficient, and scalable code.

## Repository
[Git Repository-Click here](https://github.com/SLIIT-24-25J-047-Research/INTERVIEW-PROCESSING-SYSTEM/).


### Commit History 

- **Commit History**: To view the commit history with a visual graph, use the following command:
 View complete commit history on [GitHub](https://github.com/SLIIT-24-25J-047-Research/INTERVIEW-PROCESSING-SYSTEM/commits/main).


## Features

1. **Code Complexity,Maintainability Evaluation**: Assesses the complexity of a candidate's code using metrics such as Cyclomatic Complexity (CC), Weighted Composite Complexity (WCC), and Cognitive Functional Size (CFC). These metrics help in determining how intricate or simple the code is and its suitability for long-term maintenance.
   
2. **Emotional and Problem-Solving Assessment**: Utilizes a gamified environment to evaluate candidates’ technical skills, problem-solving abilities, and emotional resilience. The system analyzes facial expressions and behavior to detect stress levels and emotions during the technical interview phase.
   
3. **Confidence and Personality Evaluation**: Analyzes the candidate's confidence level, tone, and pitch during the interview, helping to understand their communication style and assertiveness.

4. **Automated Scoring**: Automatically calculates scores for candidates based on their code complexity and maintainability, which can be used to shortlist candidates for further rounds of the interview.

5. **Deep Learning Integration:** Leverages multiple deep learning models for tasks such as voice analysis, emotional detection, and code evaluation, ensuring accurate, data-driven assessments.
   
6 **Video-Based Evaluation:** Analyzes video-based responses, including mock tests and video cover letters, to evaluate the candidate's professionalism. The system assesses factors such as attire, clarity of communication, and overall presentation, aiding in a well-rounded evaluation.


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


