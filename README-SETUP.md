# HOA System - One-Click Setup Guide

Welcome to the **Web-Based Member Information System**! This guide will walk you through the simplest way to get the system up and running on your computer.

## 📋 Prerequisites
Before running the system, make sure you have the following installed on your computer. The startup script will actually check for these and warn you if they are missing!

1. **Java Development Kit (JDK) 25**
   - Download: [Oracle JDK 25](https://www.oracle.com/java/technologies/downloads/#jdk25-windows)
   - *Ensure Java is added to your system PATH during installation.*
2. **Node.js (LTS Version)**
   - Download: [Node.js](https://nodejs.org/en/download)
   - *This includes `npm`, which is required for the frontend.*
3. **PostgreSQL**
   - Download: [PostgreSQL for Windows](https://www.postgresql.org/download/windows/)
   - **Crucial Step**: Ensure you add the PostgreSQL `bin` folder to your system's Environment Variables `PATH` (e.g., `C:\Program Files\PostgreSQL\17\bin`).
   - *Remember the password you set during installation!*

---

## 🚀 One-Click Installation

The system has been packaged to be as completely automated as possible.

### Step 1: Configure Database Password
1. Open the file named `config.bat` in a text editor (like Notepad).
2. Look for the line `set DB_PASSWORD=1234`
3. Change `1234` to whatever password you set when you installed PostgreSQL.
4. Save and close `config.bat`.

### Step 2: Manual Database Setup
1. Open **pgAdmin** or your preferred PostgreSQL client.
2. Create a new database named `hoa_db` (or the name you specified in `config.bat`).
3. Import the database structure and default data using the provided `Database/hoa_db_dump.sql` file.
   - **Using command prompt**: Open a terminal in the project folder and run:
     `psql -U postgres -d hoa_db -f Database\hoa_db_dump.sql`
   - *(Note: Replace `postgres` with your database user if different, and it may prompt for your password).*

### Step 3: Run the Startup Script
1. Double-click the file named **`START-HOA-SYSTEM.bat`**.
2. A command prompt will open and begin the setup process. It will automatically:
   - Check if you have Java, Node.js, and PostgreSQL installed correctly.
   - Install the required Node.js modules for the React frontend (this may take a few minutes on the first run).
   - Start the Spring Boot Backend server.
   - Start the React Vite Frontend server.
3. Wait for the terminal to say **"Backend is ready!"**.
4. The script will automatically open your default web browser to the system at `http://localhost:5173`.

---

## 🛑 Shutting Down the System

When you are finished using the system, do not just close the browser!
1. Double-click **`STOP-HOA-SYSTEM.bat`**.
2. This script will safely terminate the frontend and backend servers running in the background.

---

## 🛠️ Troubleshooting

- **The script says "psql - PostgreSQL client is NOT found"**
  - You did not add PostgreSQL to your system PATH. Search Windows for "Environment Variables", edit the system environment variables, find `Path`, and add the path to your PostgreSQL `bin` folder (e.g., `C:\Program Files\PostgreSQL\17\bin`).
- **The script says "Failed to create database 'hoa_db'"**
  - Open `config.bat` and ensure `DB_PASSWORD` exactly matches your PostgreSQL password.
  - Make sure the PostgreSQL service is running in Windows Services (`services.msc`).
- **The frontend or backend fails to start**
  - Run `STOP-HOA-SYSTEM.bat` to clear out any stuck processes, and try running `START-HOA-SYSTEM.bat` again.

Enjoy using the HOA Information System!
