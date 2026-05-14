# HOA System — Setup & Migration Guide

---

## ⚡ One-Click Launcher (No Docker Required)

> **This is the recommended method for demos, presentations, and server deployment.**
> Prerequisites must be installed once. After that, it's truly one double-click.

### 📋 Prerequisites (Install Once)

| Tool | Download | Check Command |
|------|----------|---------------|
| **Java JDK 25** | https://www.oracle.com/java/technologies/downloads/#jdk25-windows | `java -version` |
| **Node.js LTS** | https://nodejs.org/en/download | `node -v` |
| **PostgreSQL** | https://www.postgresql.org/download/windows/ | `psql --version` |

> **During PostgreSQL installation**, it will ask you to set a password for the `postgres` user. Write it down — you'll put it in `config.bat`.

> **After PostgreSQL is installed**, add its `bin` folder to your system PATH:
> `C:\Program Files\PostgreSQL\17\bin` (adjust `17` to your version)

---

### ⚙️ One-Time Configuration

Before running for the first time, open **`config.bat`** (in the project root) and set your PostgreSQL password:

```bat
set DB_PASSWORD=your_postgres_password_here
```

Everything else can stay as default unless you have port conflicts.

---

### 🚀 Running the System

1. **Double-click `START-HOA-SYSTEM.bat`** in the project root folder.
2. The script will:
   - ✅ Verify Java, Node.js, and PostgreSQL are installed
   - ✅ Auto-create the `hoa_db` database if it doesn't exist
   - ✅ Run `npm install` automatically if `node_modules` is missing
   - ✅ Start the Spring Boot backend in a background window
   - ✅ Start the Vite frontend in a background window
   - ✅ Wait ~50 seconds and open the app in your browser automatically
3. Once the browser opens, the system is live at **`http://localhost:5173`**

### 🛑 Stopping the System

Double-click **`STOP-HOA-SYSTEM.bat`** to cleanly shut down all services.

---

### 📁 File Summary

| File | Purpose |
|------|---------|
| `START-HOA-SYSTEM.bat` | **One-click launcher** — run this to start everything |
| `STOP-HOA-SYSTEM.bat` | Cleanly stops all running services |
| `config.bat` | **Edit this first** — set your DB password and ports |

---

### 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Java is NOT installed` | Install JDK 25 from the link above and restart the bat |
| `psql is NOT found in PATH` | Add `C:\Program Files\PostgreSQL\17\bin` to System PATH |
| `Failed to create database` | Open Services → start `postgresql-x64-17` service |
| Backend window closes immediately | Open it manually: `cd Backend && mvnw.cmd spring-boot:run` |
| Wrong password error | Edit `config.bat` and update `DB_PASSWORD` |
| Port conflict on 8081 or 5173 | Edit `config.bat` to change `BACKEND_PORT` or `FRONTEND_PORT` |

---

### 🖥️ Migrating to a New Laptop / Server

1. Copy the entire project folder to the new machine (USB, GitHub clone, etc.)
2. Install the three prerequisites (Java, Node.js, PostgreSQL)
3. Edit `config.bat` with the new machine's PostgreSQL password
4. Double-click `START-HOA-SYSTEM.bat` — done!

> **Note**: `node_modules` does not need to be copied. The launcher auto-runs `npm install` on first launch.

---

## 🐳 Peer-to-Peer Docker Migration Guide
### HOA System — Full Application + Database Transfer (Same LAN)

> **Scenario**: Both Laptop 1 and Laptop 2 will **exchange** their full application stack
> (Frontend + Backend + PostgreSQL database) with each other over the same Wi-Fi network.
> Each laptop will then run the **other's** application locally using Docker.

---

## 📋 Table of Contents
1. [Requirements](#1-requirements)
2. [Setup](#2-setup)
3. [Implementation](#3-implementation)
4. [Verification](#4-verification)

---

## 1. Requirements

### ✅ Both Laptops Must Have

| Tool | Purpose | Download |
|------|---------|----------|
| **Docker Desktop** | Run containers | https://www.docker.com/products/docker-desktop |
| **Git** (optional) | Clone repo if needed | https://git-scm.com |
| **PowerShell / Terminal** | Run commands | Pre-installed on Windows |

> **Check Docker is running:**
> ```powershell
> docker --version
> docker compose version
> ```
> Both commands must return a version number, not an error.

### ✅ Network Requirements
- Both laptops **must be on the same Wi-Fi network** (same router/hotspot).
- No VPN active on either machine during the transfer.

### ✅ Find Each Laptop's Local IP Address
Run this on **each laptop** and note down the IP:
```powershell
ipconfig
```
Look for the line: `IPv4 Address . . . . . : 192.168.X.X` under your active Wi-Fi adapter.

> 📌 **Write these down — you'll need them:**
> - **Laptop 1 IP**: `192.168.___._____`
> - **Laptop 2 IP**: `192.168.___._____`

---

## 2. Setup

### 🔧 Step 2.1 — Enable File Sharing (Windows Firewall)

> Do this on **BOTH laptops** so they can send/receive files over the LAN.

**Option A: Use a shared folder (recommended)**
1. Right-click a folder (e.g., `C:\HOA-Share`) → **Properties** → **Sharing** → **Share**
2. Add "Everyone" with read/write permission.
3. Note the network path: `\\<YOUR-IP>\HOA-Share`

**Option B: Use `scp` (requires OpenSSH)**
Check if OpenSSH is available:
```powershell
ssh -V
```
If not, enable it: **Settings → Optional Features → Add "OpenSSH Server"** and start it:
```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

---

### 🔧 Step 2.2 — Prepare the `docker-compose.yml` for Self-Contained Deployment

Both laptops need a version of `docker-compose.yml` that bundles **everything** — frontend, backend, AND a local PostgreSQL database — so the receiving laptop has zero external dependencies.

Edit `docker-compose.yml` to look like this (uncomment the `db` service):

> ⚠️ **Critical**: The `image:` fields on `backend` and `frontend` are **required**. Without them, Docker Compose auto-generates names like `hoa-app_backend` (based on your folder name), causing `docker save` to fail with `Error: No such image`.

```yaml
version: "3.8"

services:
  # ==========================================
  # LOCAL DATABASE — required for migration
  # ==========================================
  db:
    image: postgres:15
    container_name: hoa_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: hoa_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    image: hoa_backend:latest          # ← REQUIRED for docker save to work
    build:
      context: ./Backend
      dockerfile: Dockerfile
    container_name: hoa_backend
    environment:
      # OPTION 3: Local Database running inside Docker
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/hoa_db
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=1234
    ports:
      - "8081:8081"
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    image: hoa_frontend:latest          # ← REQUIRED for docker save to work
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: hoa_frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## 3. Implementation

> ⚠️ **Do these steps simultaneously.** Laptop 1 packages its app, Laptop 2 packages its app — then they swap.

---

### 📦 Phase A — Package the Application (Do on BOTH Laptops)

#### A1. Export the LOCAL Windows Database

Since your database is currently installed locally on Windows (via pgAdmin or XAMPP) and not in Docker, you must use the Windows `pg_dump` command.

1.  **Open PowerShell/Terminal** as Administrator.
2.  **Find your `pg_dump.exe` path.** It is usually in one of these locations:
    *   `C:\Program Files\PostgreSQL\<VERSION>\bin\pg_dump.exe`
    *   `C:\Program Files\pgAdmin 4\runtime\pg_dump.exe`
3.  **Run the export command**:
    ```powershell
    # Navigate to your project folder
    cd "C:\HOA Group2\HOA-A-Web-Based-Member-Information-System-with-Officer-Voting-and-Transparency-Funds"

    # Export your local database to a file
    # (If 'pg_dump' is not recognized, use the full path in quotes)
    & "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -U postgres -d hoa_db > hoa_db_dump.sql
    ```
    *Input your password when prompted (default is usually `1234`).*

> ✅ This creates `hoa_db_dump.sql` in your current directory — your **complete database backup**.

#### A2. Build Docker Images and Save Them as Files

Build all images. The `image:` tags in `docker-compose.yml` ensure they get the correct, predictable names (`hoa_backend:latest` and `hoa_frontend:latest`):
```powershell
docker compose build
```

Verify the images were created with the correct names:
```powershell
docker images | findstr "hoa"
```
You should see `hoa_backend` and `hoa_frontend` in the list.

Save each image to a `.tar` file:
```powershell
# Save the backend image
docker save hoa_backend:latest -o hoa_backend.tar

# Save the frontend image
docker save hoa_frontend:latest -o hoa_frontend.tar
```
> ℹ️ `postgres:15` will be pulled from Docker Hub on the receiving laptop, so you don't need to export it.

#### A3. Collect Everything Into One Folder

Create a transfer folder and gather all files:
```powershell
mkdir C:\HOA-Transfer

# Copy the project source (for docker-compose.yml + Dockerfiles)
Copy-Item -Recurse "C:\HOA Group2\HOA-A-Web-Based-Member-Information-System-with-Officer-Voting-and-Transparency-Funds" "C:\HOA-Transfer\HOA-App" -Force

# Copy the exported images and database dump into the transfer folder
Copy-Item hoa_backend.tar  C:\HOA-Transfer\
Copy-Item hoa_frontend.tar C:\HOA-Transfer\
Copy-Item hoa_db_dump.sql  C:\HOA-Transfer\
```

> 📁 Your `C:\HOA-Transfer\` folder should now contain:
> ```
> HOA-Transfer/
> ├── HOA-App/           ← full project folder (with docker-compose.yml)
> ├── hoa_backend.tar    ← pre-built backend image
> ├── hoa_frontend.tar   ← pre-built frontend image
> └── hoa_db_dump.sql    ← database dump
> ```

---

### 🔁 Phase B — Transfer Files to the Other Laptop

Choose **one** of the methods below:

#### Method 1: Windows Shared Folder (Easiest)
On the **sending** laptop, right-click `C:\HOA-Transfer` → Share → Everyone (Read/Write).

On the **receiving** laptop, open File Explorer and type in the address bar:
```
\\<SENDER-IP>\HOA-Transfer
```
Then copy the entire folder to your local machine (e.g., `C:\HOA-Received\`).

#### Method 2: SCP via SSH
On the **receiving** laptop, run:
```powershell
scp -r <SENDER-USERNAME>@<SENDER-IP>:C:/HOA-Transfer C:\HOA-Received
```
Example:
```powershell
scp -r jomari@192.168.1.10:C:/HOA-Transfer C:\HOA-Received
```

#### Method 3: USB Drive
Copy `C:\HOA-Transfer\` to a USB drive, then paste it on the receiving laptop as `C:\HOA-Received\`.

---

### 🚀 Phase C — Restore and Run on the Receiving Laptop

> Run these on the **receiving** laptop after transfer is complete.

#### C1. Load the Docker Images (No Rebuild Needed)
```powershell
cd C:\HOA-Received\HOA-Transfer

docker load -i hoa_backend.tar
docker load -i hoa_frontend.tar
```
> ✅ This restores the pre-built images directly. No need to rebuild.

#### C2. Start the Database Container
```powershell
cd C:\HOA-Received\HOA-Transfer\HOA-App

docker compose up -d db
```
Wait ~10 seconds for PostgreSQL to initialize.

#### C3. Import the Database Dump
```powershell
# Copy the dump file into the running container
docker cp C:\HOA-Received\HOA-Transfer\hoa_db_dump.sql hoa_db:/hoa_db_dump.sql

# Restore the dump into the database
docker exec -it hoa_db psql -U postgres -d hoa_db -f /hoa_db_dump.sql
```

#### C4. Start the Full Application Stack
```powershell
docker compose up -d
```
> This starts backend and frontend. Since images are already loaded, it won't rebuild.

---

## 4. Verification

### ✅ Step 4.1 — Confirm All Containers Are Running
```powershell
docker ps
```
You should see **3 containers** running:

| CONTAINER NAME | STATUS | PORTS |
|---------------|--------|-------|
| `hoa_db` | Up | `0.0.0.0:5432->5432/tcp` |
| `hoa_backend` | Up | `0.0.0.0:8081->8081/tcp` |
| `hoa_frontend` | Up | `0.0.0.0:3000->80/tcp` |

---

### ✅ Step 4.2 — Access the Application in a Browser

On the **receiving** laptop, open a browser and go to:
```
http://localhost:3000
```
> The HOA frontend should load.

To access from **the original laptop** (cross-device check), use the **receiving laptop's IP**:
```
http://192.168.<RECEIVING-LAPTOP-IP>:3000
```

---

### ✅ Step 4.3 — Verify the Backend API is Responding
```powershell
curl http://localhost:8081/api/members
```
Or open in browser: `http://localhost:8081/actuator/health` (if actuator is enabled)

---

### ✅ Step 4.4 — Verify the Database Has Data
```powershell
docker exec -it hoa_db psql -U postgres -d hoa_db -c "\dt"
```
This lists all tables. Then spot-check data:
```powershell
docker exec -it hoa_db psql -U postgres -d hoa_db -c "SELECT COUNT(*) FROM members;"
```

---

### ✅ Step 4.5 — Check Logs If Something Fails

**Backend logs:**
```powershell
docker logs hoa_backend --tail 50
```

**Frontend logs:**
```powershell
docker logs hoa_frontend --tail 50
```

**Database logs:**
```powershell
docker logs hoa_db --tail 50
```

---

## 🛠️ Troubleshooting

| Problem | Likely Cause | Fix |
|--------|-------------|-----|
| `docker save hoa_backend` → `Error: No such image` | Missing `image:` tag in `docker-compose.yml` — compose auto-generates a name from the folder | Add `image: hoa_backend:latest` to the backend service in compose, then rebuild with `docker compose build` |
| `docker ps` shows container as `Exited` | App crash or port conflict | Run `docker logs <container_name>` to see the error |
| Port `5432` already in use | Another Postgres is running locally (e.g., pgAdmin) | Stop the local PostgreSQL service, or change the port to `5433:5432` in compose |
| Port `8081` already in use | Another service occupies the port | Change to `8082:8081` in compose |
| `hoa_db_dump.sql` restore shows errors | DB already has tables (schema conflict) | Drop and recreate: `docker exec -it hoa_db psql -U postgres -c "DROP DATABASE hoa_db; CREATE DATABASE hoa_db;"` then re-run the restore |
| Can't reach `http://192.168.X.X:3000` from other laptop | Windows Firewall blocking inbound connections | Run: `netsh advfirewall firewall add rule name="HOA App" dir=in action=allow protocol=TCP localport=3000,8081` |
| Images not found after `docker load` | Load ran in wrong directory | `cd` into the folder containing `.tar` files before running `docker load -i` |
| App loads but shows wrong data / wrong environment | Frontend was built with a hardcoded sender IP | Ensure frontend uses relative API paths (e.g., `/api/...`), not `http://<sender-ip>:8081` |

---

## 🔁 Quick Reference — Full Command Sequence

### On the SENDER laptop:
```powershell
# 0. Navigate to your project directory
cd "C:\HOA Group2\HOA-A-Web-Based-Member-Information-System-with-Officer-Voting-and-Transparency-Funds"

# 1. Export LOCAL DB (use your actual pg_dump path)
& "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -U postgres -d hoa_db > hoa_db_dump.sql

# 2. Build and save images
docker compose build
docker save hoa_backend:latest -o hoa_backend.tar
docker save hoa_frontend:latest -o hoa_frontend.tar

# 3. Package everything
mkdir C:\HOA-Transfer
Copy-Item -Recurse "." "C:\HOA-Transfer\HOA-App" -Force
Copy-Item hoa_backend.tar, hoa_frontend.tar, hoa_db_dump.sql C:\HOA-Transfer\
```

### On the RECEIVER laptop:
```powershell
# 1. Go to the transfer folder and load the images
cd C:\HOA-Received\HOA-Transfer
docker load -i hoa_backend.tar
docker load -i hoa_frontend.tar

# 2. Start database
cd C:\HOA-Received\HOA-Transfer\HOA-App
docker compose up -d db

# 3. Restore DB (wait ~10s for DB to initialize first)
docker cp "C:\HOA-Received\HOA-Transfer\hoa_db_dump.sql" hoa_db:/hoa_db_dump.sql
docker exec -it hoa_db psql -U postgres -d hoa_db -f /hoa_db_dump.sql

# 4. Start everything
docker compose up -d

# 5. Verify containers are running
docker ps

# 6. Open the app
start http://localhost:3000
```
