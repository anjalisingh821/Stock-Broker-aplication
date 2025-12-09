@echo off
echo Building TradeHub Standalone Package...
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate

REM Build the application
echo Building application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

REM Create standalone package directory
echo Creating standalone package...
if exist dist-package rmdir /s /q dist-package
mkdir dist-package

REM Copy standalone build
xcopy /E /I /Y .next\standalone\* dist-package\
xcopy /E /I /Y .next\static dist-package\.next\static
xcopy /E /I /Y public dist-package\public
xcopy /E /I /Y prisma dist-package\prisma

REM Copy necessary files
copy package.json dist-package\
copy start.bat dist-package\
copy start.sh dist-package\

echo.
echo Standalone package created in dist-package\
echo Copy this folder to any machine with Node.js and run start.bat

pause

