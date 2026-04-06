@echo off
setlocal
cd /d "%~dp0"
php -S localhost:8082 -t backend/public
endlocal
