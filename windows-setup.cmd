@echo off
setlocal enabledelayedexpansion

echo Alt:V React Framework - Windows Setup

:: Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Node.js not found. Please install Node.js 16 or higher.
  goto :EOF
)

:: Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
  set NODE_VERSION=%%a
  set NODE_VERSION=!NODE_VERSION:~1!
)

if %NODE_VERSION% LSS 16 (
  echo Node.js version too old. Please install Node.js 16 or higher.
  goto :EOF
)

echo Using Node.js v%NODE_VERSION%

:: Install dependencies
echo Installing dependencies...
call npm install

:: Create necessary directories
echo Creating directories...
call npm run ensure-dirs

echo.
echo Setup complete! You can now:
echo 1. Create a plugin: scripts\create-plugin.cmd my-plugin
echo 2. Start development: npm run dev
echo 3. Build for production: npm run build
echo.
echo For more information, see README.md