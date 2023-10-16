# Expense Tracker Project

This Expense Tracker project is a web-based application that allows users to manage their expenses efficiently. It offers a range of essential features as well as premium capabilities to help users take control of their finances. The project is built using a Node.js and Express.js backend with SQL and Sequelize ORM for database operations, while the frontend is developed using HTML, CSS, and JavaScript with Axios for API calls. Razorpay payment gateway integration and deployment on AWS with S3 buckets for storing previous expenses are additional highlights of this project.

## Features

### Basic Features

1. **Add Expense**: Users can add new expenses with details like the date, category, amount, and description.

2. **Delete Expense**: Users can delete existing expenses to keep their records up-to-date.

3. **Edit Expense**: The edit feature allows users to modify the details of an expense, providing flexibility in managing their records.

### Premium Features

1. **Leaderboard**: Users can view a leaderboard to see their expense statistics compared to others.

2. **Monthly Data**: This feature provides users with a summary of their monthly expenses, helping them understand their spending patterns.

3. **Download Reports**: Users can generate and download expense reports for their records or further analysis.

4. **Previous Downloads**: The system stores previously downloaded reports for easy access and reference.

5. **Pagination**: The project offers pagination for a user-friendly browsing experience, especially when dealing with a large number of expenses.

## Technologies Used

- **Backend**: Node.js, Express.js, SQL, Sequelize ORM
- **Frontend**: HTML, CSS, JavaScript
- **API Calls**: Axios
- **Payment Gateway Integration**: Razorpay
- **Deployment**: AWS
- **Data Storage**: AWS S3 buckets for storing previous expenses

## Setup and Installation

1. Clone the repository to your local machine.

   ```bash
   git clone https://github.com/MudassirQuraishi/DSA_S3P3R.git
   ```

2. Install the necessary dependencies for both the frontend and backend.

3. Configure your database connection in the `config/database.js` file.

4. Start the backend server.

   ```bash
   npm start
   ```

5. Access the Expense Tracker in your web browser at `http://localhost:3000`.

## Usage

1. Sign up or log in to your account.

2. Start tracking your expenses by adding, editing, or deleting records.

3. Explore premium features like the leaderboard, monthly data, and report generation.

4. Make payments for premium features using the integrated Razorpay payment gateway.

## Contributions

Contributions to this project are welcome. You can submit bug reports or suggest new features by creating issues in the project repository. If you want to contribute code, please fork the repository and submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or need assistance with this project, please contact the project maintainers:

- Email: [mudassir.quraishi14@outlook.com](mailto:mudassir.quraishi14@outlook.com)
- GitHub: [Mudassir_Quraishi](https://github.com/MudassirQuraishi)

Thank you for using the Expense Tracker project! We hope it helps you manage your expenses effectively.
