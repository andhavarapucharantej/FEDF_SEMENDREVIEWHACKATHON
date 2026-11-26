@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\vite\bin\vite.js" (
  where npm >nul 2>nul
  if errorlevel 1 (
    echo Node.js with npm is required to install this website's dependencies.
    pause
    exit /b 1
  )
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed. Review the error above and try again.
    pause
    exit /b 1
  )
)

node "node_modules\vite\bin\vite.js" --host 127.0.0.1 --open
