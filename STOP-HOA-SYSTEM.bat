@echo off
setlocal enabledelayedexpansion
title HOA System - Shutdown
color 0C

:: Load config for port numbers
call "%~dp0config.bat" 2>nul
if errorlevel 1 (
    set BACKEND_PORT=8081
    set FRONTEND_PORT=5173
)

echo.
echo  ==========================================
echo   HOA System - Stopping All Services
echo  ==========================================
echo.

:: Stop process on Backend port
echo  Stopping Backend (port %BACKEND_PORT%)...
for /f "tokens=5" %%p in ('netstat -aon 2^>nul ^| findstr ":%BACKEND_PORT% "') do (
    echo    Killing PID %%p
    taskkill /PID %%p /F >nul 2>&1
)

:: Stop process on Frontend port
echo  Stopping Frontend (port %FRONTEND_PORT%)...
for /f "tokens=5" %%p in ('netstat -aon 2^>nul ^| findstr ":%FRONTEND_PORT% "') do (
    echo    Killing PID %%p
    taskkill /PID %%p /F >nul 2>&1
)

:: Kill any leftover Java/mvnw processes from this project
echo  Cleaning up any remaining Java processes...
taskkill /IM java.exe /F >nul 2>&1

echo.
echo  [OK] All HOA System services have been stopped.
echo.
pause
