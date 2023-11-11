# sabzlearn <img alt="Static Badge" src="https://img.shields.io/badge/Node_Js-Backend?logo=nodedotjs&label=Backend"> <img alt="Static Badge" src="https://img.shields.io/badge/express-framework?logo=express&logoColor=white&label=framework"> <img alt="Static Badge" src="https://img.shields.io/badge/html-languages?logo=html5&logoColor=white&labelColor=red&color=red"> <img alt="Static Badge" src="https://img.shields.io/badge/css3-languages?logo=css3&logoColor=white&labelColor=blue&color=blue"> <img alt="Static Badge" src="https://img.shields.io/badge/javascript-languages?logo=css3&logoColor=white&labelColor=yellow&color=yellow">


👋 **Welcome to Sabzlern Project**

## Project Description

Sabzlern is a website dedicated to selling programming courses. It aims to provide learners with a comprehensive platform to explore and purchase courses related to various programming languages and technologies. Whether you are a beginner or an experienced developer looking to expand your skills, Sabzlern offers a wide range of courses to cater to your learning needs.

## Features

- **Course Catalog**: Browse through the extensive collection of programming courses available on Sabzlern. Filter courses by language, technology, difficulty level, and more to find the perfect fit for your learning goals.

- **Course Details**: Get detailed information about each course, including the course content, duration, instructor details, and user reviews. Make an informed decision before purchasing a course.

- **User Accounts**: Create a personal account to access additional features like saving courses for later, viewing your purchase history, and leaving reviews for completed courses.

- **Secure Payment Gateway**: Safely and conveniently make payments for your selected courses using a secure payment gateway. Multiple payment options are available to cater to your preferences.

- **Course Progress Tracking**: Keep track of your progress in each course. Mark lessons as complete, track your quiz scores, and pick up where you left off whenever you log in.

## Technologies Used

- Front-end: HTML5, CSS3, JavaScript
- Back-end: Node.js, Express.js
- Database: Mysql

## Setup

To set up the project locally, follow the steps below:

1. Clone the repository:

   ```
   https://github.com/mahdibabaei86/sabzlearn.git
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Set up the environment variables:
   
   - Create a `.env` file in the root folder backend directory.
   - Provide the necessary environment variables in the following format:

     ```
      secretKeyJWT = secretKeyJWT
      DB_HOST= localhost
      DB_USER= User
      DB_PASSWORD= password
      DB_NAME= name
      EMAIL= example@gmail.com
      PASSEMAIL= passwordemail
     ```

5. The output file of the project tables located inside the backend folder. import in your database.
6. Go to the backend folder and execute the following commands in cmd.

   ```
   mkdir uploads
   cd uploads
   mkdir covers
   mkdir IntroductionVideoCourse
   mkdir mainfile
   ```

7. Start the development server:

   ```
   npm nodemon server
   ```

8. Open your browser and access `http://localhost:3000` to view the website.

## Contributing

Contributions to Sabzlern project are welcome! If you have any suggestions, bug reports, or would like to add new features, please feel free to submit a pull request. Ensure that you follow the existing code style and adhere to good programming practices.

## License

This project is licensed under the MIT License. Please see the [LICENSE](LICENSE) file for more details.

---

We hope you find Sabzlern an engaging and informative platform for learning programming. If you have any questions or need further assistance, please don't hesitate to reach out.

Happy coding! 🚀
