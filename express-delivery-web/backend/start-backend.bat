@echo off
echo Cleaning up previous Node.js processes...

REM Terminate all node.exe processes
for /f "tokens=2" %%i in ('tasklist ^| findstr node.exe') do (
    echo Terminating process: %%i
    taskkill /f /pid %%i >nul 2>&1
)

REM Wait a bit to ensure processes are fully terminated
timeout /t 2 /nobreak >nul

REM Kill processes using port 3000
echo Checking for processes using port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Found process using port 3000: %%a
    taskkill /f /pid %%a >nul 2>&1
)

REM Wait a bit more
timeout /t 2 /nobreak >nul

echo Starting backend server...
npx ts-node src/server.ts