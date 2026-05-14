:: ============================================================
::  HOA System Configuration
::  Edit this file to match your local PostgreSQL setup.
::  DO NOT wrap values in quotes.
:: ============================================================

:: --- DATABASE SETTINGS ---
:: The name of your PostgreSQL database (script will create it if missing)
set DB_NAME=hoa_db

:: Your PostgreSQL superuser (default is "postgres")
set DB_USER=postgres

:: The password you set during PostgreSQL installation
:: CHANGE THIS to your actual PostgreSQL password!
set DB_PASSWORD=1234

:: PostgreSQL port (default is 5432)
set DB_PORT=5432

:: --- PORT SETTINGS ---
:: Spring Boot backend port (must match Backend/src/main/resources/application.properties)
set BACKEND_PORT=8081

:: Vite frontend port (default is 5173)
set FRONTEND_PORT=5173
