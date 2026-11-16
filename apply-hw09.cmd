@echo off
cd /d "%~dp0"
node apply-hw09.cjs
if errorlevel 1 ( pause & exit /b 1 )
call npm.cmd install
if errorlevel 1 ( pause & exit /b 1 )
call npm.cmd run build
pause
