@echo off
chcp 65001 >nul
echo === Чат Хорошее настроение (ru.gruzin) ===

where java >nul 2>nul
if errorlevel 1 (
  echo [Ошибка] Java (JDK 17+) не найдена в PATH.
  pause
  exit /b 1
)

where mvn >nul 2>nul
if errorlevel 1 (
  echo [Ошибка] Maven (mvn) не найден в PATH. Установите Apache Maven и добавьте в PATH.
  pause
  exit /b 1
)

echo Запуск Spring Boot на http://localhost:8099/ ...
mvn clean spring-boot:run
pause
