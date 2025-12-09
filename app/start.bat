@echo off
echo Starting TradeHub Stock Broker Application...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Generate Prisma Client if needed
if not exist "node_modules\.prisma" (
    echo Generating Prisma Client...
    call npx prisma generate
)

REM Run database migrations
echo Running database migrations...
call npx prisma migrate deploy

REM Start the application
echo.
echo Starting application on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm run dev

