@echo off
cd /d "%~dp0"
git pull origin main
git add .
set /p m=Mensagem: 
git commit -m "%m%"
git push origin main
echo Deploy iniciado na Vercel!
timeout /t 3