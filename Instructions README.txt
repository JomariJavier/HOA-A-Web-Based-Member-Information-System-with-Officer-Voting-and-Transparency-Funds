====================================================================
HOA - WEB-BASED MEMBER INFORMATION SYSTEM
DEVELOPER SETUP GUIDE
====================================================================
Welcome to the team! 👋 

Since we are collaborating remotely, this guide is designed to get your 
computer 100% ready for development, assuming you are starting from a 
freshly installed Windows 11 device. 

Our stack is: React (Frontend) + Spring Boot (Backend) + PostgreSQL (Database).
Please follow these steps IN ORDER. Do not skip any!

--------------------------------------------------------------------
PHASE 1: CORE SOFTWARE INSTALLATIONS (The Engines)
--------------------------------------------------------------------
You need to download and install these foundational tools. Leave all 
installers on their "Default" settings unless specified.

1. GitHub Desktop
   - Why: Our visual tool for syncing code. No typing commands needed.
   - Link: https://desktop.github.com/

2. Node.js (LTS Version)
   - Why: Needed to run our React Frontend and manage 'npm' packages.
   - Link: https://nodejs.org/en/download
   - Check: Open Command Prompt and type `node -v`. It should show a version number.

3. Java Development Kit (JDK 25)
   - Why: The programming language for our Spring Boot Backend.
   - Link: https://www.oracle.com/java/technologies/downloads/#jdk25-windows
   - Check: Open Command Prompt and type `java -version`.

4. PostgreSQL & pgAdmin 4
   - Why: Our centralized database for storing member info and funds.
   - Link: https://www.postgresql.org/download/windows/
   - CRITICAL SETUP: During installation, it will ask for a password for 
     the "postgres" superuser. Write this password down! You will need it later.

5. Visual Studio Code (VS Code)
   - Why: Our team's primary code editor.
   - Link: https://code.visualstudio.com/

--------------------------------------------------------------------
PHASE 2: VS CODE EXTENSIONS (The Tools)
--------------------------------------------------------------------
Open VS Code, click the "Extensions" icon on the left (the 4 blocks), 
and install exactly these extensions to aid in coding and debugging:

For Backend (Java/Spring Boot):
1. "Extension Pack for Java" by Microsoft
2. "Spring Boot Extension Pack" by VMware

For Frontend (React/Web):
3. "ES7+ React/Redux/React-Native snippets" by dsznajder (Helps write React faster)
4. "Prettier - Code formatter" (Keeps our team's code looking identical/clean)

For Database:
5. "PostgreSQL" by Chris Kolkman (Allows you to view tables inside VS Code)

--------------------------------------------------------------------
PHASE 3: CLONING THE PROJECT (Via GitHub Desktop)
--------------------------------------------------------------------
1. Open GitHub Desktop and Sign In to your GitHub account.
2. Go to File -> Clone Repository.
3. Select the "URL" tab and paste our project link.
4. Choose a "Local Path" (e.g., Documents/Projects). Click Clone.
5. Once finished, click "Open in Visual Studio Code" inside the app.

--------------------------------------------------------------------
PHASE 4: DATABASE SETUP
--------------------------------------------------------------------
Before running the code, we must prepare your local database.

1. Open the "pgAdmin 4" app on your computer.
2. Enter the password you created during Phase 1.
3. On the left sidebar, expand "Servers" -> "PostgreSQL".
4. Right-click "Databases" -> Create -> Database...
5. Name the database EXACTLY: hoa_db
6. Click Save. (You don't need to create tables; Spring Boot does this automatically!)

--------------------------------------------------------------------
PHASE 5: RUNNING THE BACKEND (Spring Boot)
--------------------------------------------------------------------
We need to connect your local code to your local database.

1. In VS Code, go to: Backend/src/main/resources/application.properties
2. Find the line: `spring.datasource.password=...`
3. Change it to the PASSWORD YOU SET for PostgreSQL in Phase 1. Save the file.
4. Right-click the "Backend" folder in VS Code and select "Open in Integrated Terminal".
5. Run this command to download Java dependencies and start the server:
   .\mvnw clean spring-boot:run
   
   *Wait until you see "Started BackendApplication" in the terminal.*
   *Note: This runs on port 8080.*

--------------------------------------------------------------------
PHASE 6: RUNNING THE FRONTEND (React)
--------------------------------------------------------------------
1. Open a SECOND terminal window in VS Code (Keep the backend running!).
2. Navigate to the Frontend folder by typing:
   cd Frontend
3. Download the necessary React packages by running:
   npm install
4. Start the Frontend server by running:
   npm run dev

   *This will give you a local link (usually http://localhost:5173).*

--------------------------------------------------------------------
PHASE 7: VERIFICATION (Did it work?)
--------------------------------------------------------------------
1. Ctrl+Click the http://localhost:5173 link in your Frontend terminal.
2. The browser will open the HOA Member Manager.
3. Type a name into the input box and click "Add Member".
4. If the name appears in the list below, congratulations! Your Frontend 
   talked to your Backend, and saved data to your Database. 

You are now ready to start coding! If you hit any errors during setup, 
take a screenshot of the terminal and send it to the team chat.