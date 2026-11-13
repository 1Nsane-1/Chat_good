#!/usr/bin/env bash
set -e
echo "=== Чат Хорошее настроение (ru.gruzin) ==="

if ! command -v java >/dev/null 2>&1; then
  echo "[Ошибка] Не найдена Java (нужна JDK 17 или новее)."
  echo "Установите JDK 17+: sudo apt install openjdk-17-jdk  (или pacman -S jdk17-openjdk)"
  exit 1
fi

if ! command -v mvn >/dev/null 2>&1; then
  echo "[Ошибка] Не найден Apache Maven (команда mvn)."
  echo "Установите Maven: sudo apt install maven  (или pacman -S maven)"
  exit 1
fi

echo "Запуск Spring Boot на http://localhost:8099/ ..."
echo "Остановить сервер: Ctrl+C"
mvn clean spring-boot:run
