@echo off
setlocal enabledelayedexpansion
title HOA System Launcher
color 0A

:: ============================================================
::  HOA - WEB-BASED MEMBER INFORMATION SYSTEM
::  One-Click Launcher v1.0
::  Stack: React (Vite) + Spring Boot + PostgreSQL
:: ============================================================

echo.
echo  ==========================================
echo   HOA Member Information System Launcher
echo  ==========================================
echo.

:: -------------------------------------------------------
:: STEP 0: Load configuration (editable by user)
:: -------------------------------------------------------
if exist "%~dp0config.bat" (
    call "%~dp0config.bat"
) else (
    echo  [WARN] config.bat not found. Using default settings.
    set DB_NAME=hoa_db
    set DB_USER=postgres
    set DB_PASSWORD=1234
    set DB_PORT=5432
    set BACKEND_PORT=8081
    set FRONTEND_PORT=5173
)

echo  [CONFIG] Database : %DB_NAME% on port %DB_PORT%
echo  [CONFIG] Backend  : http://localhost:%BACKEND_PORT%
echo  [CONFIG] Frontend : http://localhost:%FRONTEND_PORT%
echo.

:: -------------------------------------------------------
:: STEP 1: Check Prerequisites
:: -------------------------------------------------------
echo  [1/5] Checking prerequisites...
echo.

:: Check Java
java -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] Java is NOT installed or not in PATH.
    echo.
    echo  Please install Java JDK 25 from:
    echo  https://www.oracle.com/java/technologies/downloads/#jdk25-windows
    echo.
    echo  After installing, restart this script.
    pause
    exit /b 1
)
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VER=%%g
)
echo  [OK] Java found: !JAVA_VER!

:: Check Node.js
node -v >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] Node.js is NOT installed or not in PATH.
    echo.
    echo  Please install Node.js LTS from:
    echo  https://nodejs.org/en/download
    echo.
    echo  After installing, restart this script.
    pause
    exit /b 1
)
for /f %%v in ('node -v') do set NODE_VER=%%v
echo  [OK] Node.js found: %NODE_VER%

:: Check npm
call npm -v >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] npm is NOT found. Reinstall Node.js to fix this.
    pause
    exit /b 1
)
for /f %%v in ('npm -v') do set NPM_VER=%%v
echo  [OK] npm found: v%NPM_VER%

:: Check PostgreSQL (psql)
psql --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] psql - PostgreSQL client is NOT found in PATH.
    echo.
    echo  Please install PostgreSQL from:
    echo  https://www.postgresql.org/download/windows/
    echo.
    echo  Then add its bin folder to your system PATH, e.g.:
    echo    C:\Program Files\PostgreSQL\17\bin
    echo.
    pause
    exit /b 1
)
for /f "tokens=3" %%v in ('psql --version') do set PG_VER=%%v
echo  [OK] PostgreSQL psql found: v%PG_VER%

echo.
echo  All prerequisites satisfied!
echo.

:: -------------------------------------------------------
:: STEP 2: Setup Database
:: -------------------------------------------------------
echo  [2/5] Setting up database...
echo.

set PGPASSWORD=%DB_PASSWORD%

:: Check if hoa_db already exists
psql -U %DB_USER% -p %DB_PORT% -h localhost -lqt 2>nul | findstr /C:"%DB_NAME%" >nul
if errorlevel 1 (
    echo  Database '%DB_NAME%' not found. Creating it now...
    psql -U %DB_USER% -p %DB_PORT% -h localhost -c "CREATE DATABASE %DB_NAME%;" >nul 2>&1
    if errorlevel 1 (
        color 0C
        echo.
        echo  [ERROR] Failed to create database '%DB_NAME%'.
        echo.
        echo  Possible causes:
        echo    1. PostgreSQL service is not running.
        echo       - Open Services ^(Win+R, type services.msc^)
        echo       - Find "postgresql-x64-XX" and click Start
        echo    2. Wrong password in config.bat
        echo       - Open config.bat and update DB_PASSWORD
        echo    3. Wrong DB_USER (default is "postgres")
        echo.
        pause
        exit /b 1
    )
    echo  [OK] Database '%DB_NAME%' created successfully!
    echo.
    if exist "%~dp0Database\hoa_db_dump.sql" (
        echo  [INFO] Found 'hoa_db_dump.sql'. Importing database schema and default data...
        set PGPASSWORD=%DB_PASSWORD%
        psql -U %DB_USER% -p %DB_PORT% -h localhost -d %DB_NAME% -f "%~dp0Database\hoa_db_dump.sql" >nul 2>&1
        if errorlevel 1 (
            color 0E
            echo  [WARN] Failed to import database dump completely, but continuing...
        ) else (
            echo  [OK] Database imported successfully! No manual setup required.
        )
    ) else (
        echo  [INFO] No database dump found at Database\hoa_db_dump.sql.
    )
) else (
    echo  [OK] Database '%DB_NAME%' already exists. Skipping creation and data import.
)
echo.

:: -------------------------------------------------------
:: STEP 3: Install Frontend Dependencies (if needed)
:: -------------------------------------------------------
echo  [3/5] Checking frontend dependencies...
echo.

if not exist "%~dp0Frontend\node_modules" (
    echo  node_modules not found. Running npm install...
    echo  - This only happens once or after a fresh clone, may take a few minutes -
    echo.
    cd /d "%~dp0Frontend"
    call npm install
    if errorlevel 1 (
        color 0C
        echo.
        echo  [ERROR] npm install failed. Check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
    echo  [OK] Frontend dependencies installed.
) else (
    echo  [OK] node_modules found. Skipping npm install.
)
echo.

:: -------------------------------------------------------
:: STEP 4: Start Backend (Spring Boot)
:: -------------------------------------------------------
echo  [4/5] Starting Spring Boot backend on port %BACKEND_PORT%...
echo.

:: Kill any existing process on the backend port
for /f "tokens=5" %%p in ('netstat -aon 2^>nul ^| findstr ":%BACKEND_PORT% "') do (
    taskkill /PID %%p /F >nul 2>&1
)

:: Pass DB credentials as environment variables so config.bat password is used
set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:%DB_PORT%/%DB_NAME%
set SPRING_DATASOURCE_USERNAME=%DB_USER%
set SPRING_DATASOURCE_PASSWORD=%DB_PASSWORD%

start "HOA Backend (Spring Boot)" /min cmd /c "cd /d "%~dp0Backend" && title HOA - Backend && color 0B && echo Starting Spring Boot... && mvnw.cmd spring-boot:run && pause"

echo  [OK] Backend starting in background window (minimized).
echo  It may take 30-60 seconds to fully start on the first run.
echo.

:: -------------------------------------------------------
:: STEP 5: Start Frontend (Vite / React)
:: -------------------------------------------------------
echo  [5/5] Starting React frontend on port %FRONTEND_PORT%...
echo.

:: Kill any existing process on the frontend port
for /f "tokens=5" %%p in ('netstat -aon 2^>nul ^| findstr ":%FRONTEND_PORT% "') do (
    taskkill /PID %%p /F >nul 2>&1
)

start "HOA Frontend (Vite)" /min cmd /c "cd /d "%~dp0Frontend" && title HOA - Frontend && color 09 && echo Starting Vite dev server... && npm run dev && pause"

echo  [OK] Frontend starting in background window (minimized).
echo.

:: -------------------------------------------------------
:: STEP 6: Smart wait - poll backend until it's ready
:: -------------------------------------------------------
echo  ==========================================
echo   Waiting for backend to come online...
echo   Browser will open automatically when ready.
echo  ==========================================
echo.

set /a MAX_WAIT=90
set /a ELAPSED=0
set BACKEND_READY=0

:POLL_LOOP
:: Use PowerShell to do a quick HTTP check on the backend
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:%BACKEND_PORT%/api/auth/login' -Method OPTIONS -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 (
    set BACKEND_READY=1
    goto :BACKEND_UP
)

set /a ELAPSED+=3
if %ELAPSED% geq %MAX_WAIT% (
    echo  [WARN] Backend took too long to start. Opening browser anyway...
    goto :BACKEND_UP
)

set /p "=  Backend starting... elapsed %ELAPSED%s / %MAX_WAIT%s max" <nul
echo.
timeout /t 3 /nobreak >nul
goto :POLL_LOOP

:BACKEND_UP
echo.
if "%BACKEND_READY%"=="1" (
    echo  [OK] Backend is ready! ^(took ~%ELAPSED% seconds^)
) else (
    echo  [WARN] Opening browser anyway - backend may still be loading.
)
echo.
echo  Opening HOA System in your default browser...
start "" "http://localhost:%FRONTEND_PORT%"

echo.
echo  ==========================================
echo   HOA System is now running!
echo  ==========================================
echo.
echo   Frontend : http://localhost:%FRONTEND_PORT%
echo   Backend  : http://localhost:%BACKEND_PORT%
echo   Database : %DB_NAME% ^(PostgreSQL on port %DB_PORT%^)
echo.
echo   Minimize this window to keep the system running.
echo   Run STOP-HOA-SYSTEM.bat to shut everything down.
echo.
echo  ==========================================
echo.
pause
