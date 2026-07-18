#!/bin/sh
set -e

# Default DATABASE_URL if not provided
if [ -z "$DATABASE_URL" ]; then
    DATABASE_URL="sqlite+aiosqlite:////app/route53.db"
fi

# Detect SQLite database usage and auto-seed if file is missing
if echo "$DATABASE_URL" | grep -q "sqlite"; then
    DB_FILE=$(echo "$DATABASE_URL" | sed -E 's|^sqlite\+aiosqlite:////|/|; s|^sqlite\+aiosqlite:///||')
    if [ ! -f "$DB_FILE" ]; then
        echo "SQLite database file not found at $DB_FILE. Initializing and seeding..."
        mkdir -p "$(dirname "$DB_FILE")"
        python sample.py
    else
        echo "SQLite database file found at $DB_FILE. Skipping seed."
    fi
else
    echo "Using custom or non-SQLite database URL ($DATABASE_URL)."
fi

# Run the backend server
exec uvicorn main:app --host 0.0.0.0 --port 8000
