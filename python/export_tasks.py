"""
Скрипт экспорта задач из PostgreSQL в CSV.
"""

import csv
import os
from datetime import datetime

import psycopg
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
    "dbname": os.getenv("DB_NAME", "task_manager"),
}

QUERY = """
    SELECT id, title, description, status, created_at
    FROM tasks
    ORDER BY id
"""


def export_tasks():
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cursor:
            cursor.execute(QUERY)
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]

    filename = f"tasks_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    output_path = os.path.join(os.path.dirname(__file__), filename)

    with open(output_path, "w", newline="", encoding="utf-8-sig") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(columns)
        writer.writerows(rows)

    print(f"Экспортировано задач: {len(rows)}")
    print(f"Файл сохранён: {output_path}")


if __name__ == "__main__":
    export_tasks()
