"""
Migration: Create emails table
Version: 002
Description: Creates emails table with core email fields and attachment metadata
"""

import os
import sqlite3
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import DATABASE_PATH


def upgrade():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    cursor.execute("SELECT 1 FROM _migrations WHERE name = ?", ("002_create_emails_table",))
    if cursor.fetchone():
        print("Migration 002_create_emails_table already applied. Skipping.")
        conn.close()
        return

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_name TEXT NOT NULL,
            sender_email TEXT NOT NULL,
            recipient_name TEXT NOT NULL,
            recipient_email TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            preview TEXT NOT NULL,
            received_at TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            is_archived INTEGER DEFAULT 0,
            attachment_name TEXT,
            attachment_size TEXT,
            attachment_type TEXT,
            attachment_url TEXT
        )
        """
    )

    sample_emails = [
        (
            "Zara Keegan",
            "zara.keegan@redwood.io",
            "Richard Brown",
            "richard.brown@proscape.com",
            "🎉 Campaign Kickoff Brief",
            "Hi Richard,\n\nSharing the kickoff brief for the new email campaign. We are targeting a 14-day launch timeline with daily performance snapshots.\n\nLet me know if you want to add a QA pass before we go live.\n\nThanks,\nZara",
            "Sharing the kickoff brief for the new email campaign. We are targeting a 14-day launch timeline...",
            "2024-08-20T09:30:00",
            0,
            0,
            "Kickoff-Brief.pdf",
            "4.2 MB",
            "PDF",
            "https://files.example.com/kickoff-brief.pdf",
        ),
        (
            "Martin Griffin",
            "martin.griffin@orbital.io",
            "Richard Brown",
            "richard.brown@proscape.com",
            "Q3 Metrics Snapshot 📈",
            "Richard,\n\nAttached are the Q3 metrics highlights. Key wins: 12% MoM growth, 3.2x CAC payback.\n\nWe should align on a follow-up plan this week.\n\nBest,\nMartin",
            "Attached are the Q3 metrics highlights. Key wins: 12% MoM growth, 3.2x CAC payback...",
            "2024-08-19T16:12:00",
            1,
            0,
            "Q3-Metrics.xlsx",
            "1.1 MB",
            "XLSX",
            "https://files.example.com/q3-metrics.xlsx",
        ),
        (
            "Team Updates",
            "updates@proscape.com",
            "Richard Brown",
            "richard.brown@proscape.com",
            "Weekly Digest: Product & Growth",
            "Hi Richard,\n\nHere is your weekly digest summarizing product updates, marketing wins, and customer highlights.\n\nCheers,\nThe Proscape Team",
            "Here is your weekly digest summarizing product updates, marketing wins, and customer highlights...",
            "2024-08-18T08:00:00",
            1,
            0,
            None,
            None,
            None,
            None,
        ),
    ]

    cursor.executemany(
        """
        INSERT INTO emails (
            sender_name, sender_email, recipient_name, recipient_email,
            subject, body, preview, received_at, is_read, is_archived,
            attachment_name, attachment_size, attachment_type, attachment_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        sample_emails,
    )

    cursor.execute("INSERT INTO _migrations (name) VALUES (?)", ("002_create_emails_table",))

    conn.commit()
    conn.close()
    print("Migration 002_create_emails_table applied successfully.")


def downgrade():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute("DROP TABLE IF EXISTS emails")
    cursor.execute("DELETE FROM _migrations WHERE name = ?", ("002_create_emails_table",))

    conn.commit()
    conn.close()
    print("Migration 002_create_emails_table reverted successfully.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run database migration")
    parser.add_argument(
        "action",
        choices=["upgrade", "downgrade"],
        help="Migration action to perform",
    )

    args = parser.parse_args()

    if args.action == "upgrade":
        upgrade()
    elif args.action == "downgrade":
        downgrade()