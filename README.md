# Grade Calculator - GPA Management System

A comprehensive web application for managing academic grades, calculating GPA, and tracking learning progress.

## Features

- **GPA Calculator**: Automatic GPA calculation with visual progress tracking
- **Practice Tests**: Interactive practice tests with analytics
- **Personal Profile**: User profile management and academic history
- **Lecture Management**: Organize and access lecture materials
- **Progress Tracking**: Detailed analytics and visualizations
- **User Authentication**: Secure login/signup with role-based access

## Tech Stack

- **Frontend**: React.js, Material-UI, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **State Management**: Redux Toolkit
- **Authentication**: JWT, bcrypt
- **Charts**: Chart.js, Recharts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/grade-calculator.git
   cd grade-calculator
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. **Start the development servers**
   
   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend:**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## Deployment to GitHub Pages

### Prerequisites

1. **Update homepage URL**
   Edit `package.json` and replace `your-username` with your actual GitHub username:
   ```json
   {
     "homepage": "https://your-username.github.io/grade-calculator"
   }
   ```

2. **Ensure gh-pages is installed**
   ```bash
   npm install --save-dev gh-pages
   ```

### Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Set Source to "Deploy from a branch"
   - Select "gh-pages" branch
   - Save the settings

4. **Access your deployed application**
   Your application will be available at: `https://your-username.github.io/grade-calculator`

### Important Notes for GitHub Pages Deployment

- The application uses HashRouter for client-side routing compatibility with GitHub Pages
- Static assets are served from the `build` folder
- The backend API calls will need to be updated to point to your deployed backend server
- Update the `proxy` field in `package.json` to point to your production backend URL

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run deploy` - Deploys to GitHub Pages

## Project Structure

```
grade-calculator/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── apis/          # API service functions
│   ├── features/      # Redux slices and services
│   ├── contexts/      # React contexts
│   └── utils/         # Utility functions
├── backend/           # Node.js backend server
├── public/           # Static assets
└── package.json      # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@gradecalculator.com or create an issue in the repository.
