# Student Progress Tracker - Backend Setup

## MongoDB Setup Instructions

### Option 1: Local MongoDB Setup (Windows)

1. Download MongoDB Community Server:
   - Go to https://www.mongodb.com/try/download/community
   - Select Version: 6.0.x (Latest)
   - Platform: Windows
   - Package: MSI

2. Install MongoDB:
   - Run the downloaded MSI installer
   - Choose "Complete" installation type
   - Install MongoDB Compass when prompted
   - Install MongoDB as a Service (default option)

3. Verify Installation:
   - Open Command Prompt as Administrator
   - Run: `net start MongoDB`
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`

### Option 2: MongoDB Atlas Setup (Cloud)

1. Create MongoDB Atlas Account:
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create a free account
   - Create a new cluster (FREE shared cluster)

2. Configure Database Access:
   - Click "Connect" on your cluster
   - Add your IP to whitelist
   - Create database user
   - Save username and password

3. Get Connection String:
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<clustername>` in .env file

## Environment Setup

1. Create `.env` file in backend folder (already done)
2. Choose your MongoDB connection:
   - For local: Set `MONGODB_URI=mongodb://localhost:27017/studentprogress`
   - For Atlas: Set `MONGODB_URI=mongodb+srv://<username>:<password>@<clustername>.mongodb.net/studentprogress?retryWrites=true&w=majority`

## Running the Backend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Test the connection:
   - Open browser
   - Go to: http://localhost:5000/api/health
   - Should see: `{"status":"ok","mongodb":"connected"}`

## Troubleshooting

### Local MongoDB Issues:
1. Check if MongoDB service is running:
   ```bash
   net start MongoDB
   ```
2. Check MongoDB logs:
   - Open Event Viewer
   - Windows Logs > Application
   - Look for MongoDB entries

### Atlas Connection Issues:
1. Verify IP whitelist includes your current IP
2. Check username and password in connection string
3. Ensure cluster is running (check Atlas dashboard)

## API Endpoints

1. GET `/api/students`
   - Query parameters:
     - page (default: 1)
     - limit (default: 10)
     - sortBy (default: name)
     - sortOrder (asc/desc)
     - name (search by name)
     - minGrade/maxGrade
     - class
     - section
     - status

2. GET `/api/students/:id`
   - Get single student with details

3. POST `/api/students`
   - Create new student
   - Required fields: name, grade

4. PATCH `/api/students/:id`
   - Update student information

5. DELETE `/api/students/:id`
   - Delete student

6. GET `/api/students/stats/class/:className`
   - Get class statistics
