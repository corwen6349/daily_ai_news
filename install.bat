@echo off
cd /d "%~dp0"
echo Installing dependencies with npm...
call npm install
echo Done!
pause
