@echo off
title Jalankan Semua (Frontend + Backend + Python)
echo Memulai semua layanan...

:: === Backend ===
echo Menjalankan Backend...
start cmd /k "cd backend && node server.js"

:: === Frontend ===
echo Menjalankan Frontend...
start cmd /k "cd frontend && npm run dev"

:: === Python Predict ===
echo Menjalankan Service Python (predict_emisi.py)...
start cmd /k "cd check_emisi && call .\venv\Scripts\activate && python predict_emisi.py"

:: === Tunggu sebentar dan buka browser ===
timeout /t 5 >nul
start http://localhost:5173

echo Semua layanan dijalankan.
