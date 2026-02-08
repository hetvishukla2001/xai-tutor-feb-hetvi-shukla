from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.database import get_db

router = APIRouter(prefix="/emails", tags=["emails"])


class Attachment(BaseModel):
    file_name: str
    file_size: str
    file_type: str
    download_url: Optional[str] = None


class EmailCreate(BaseModel):
    sender_name: str
    sender_email: str
    recipient_name: str
    recipient_email: str
    subject: str
    body: str
    preview: str
    received_at: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False
    is_archived: bool = False
    attachment: Optional[Attachment] = None


class EmailUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_archived: Optional[bool] = None


class EmailResponse(BaseModel):
    id: int
    sender_name: str
    sender_email: str
    recipient_name: str
    recipient_email: str
    subject: str
    body: str
    preview: str
    received_at: datetime
    is_read: bool
    is_archived: bool
    attachment: Optional[Attachment] = None


@router.get("")
def list_emails():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, sender_name, sender_email, recipient_name, recipient_email,
                       subject, body, preview, received_at, is_read, is_archived,
                       attachment_name, attachment_size, attachment_type, attachment_url
                FROM emails
                ORDER BY datetime(received_at) DESC
                """
            )
            rows = cursor.fetchall()
            emails = []
            for row in rows:
                attachment = None
                if row["attachment_name"]:
                    attachment = {
                        "file_name": row["attachment_name"],
                        "file_size": row["attachment_size"],
                        "file_type": row["attachment_type"],
                        "download_url": row["attachment_url"],
                    }
                emails.append(
                    {
                        "id": row["id"],
                        "sender_name": row["sender_name"],
                        "sender_email": row["sender_email"],
                        "recipient_name": row["recipient_name"],
                        "recipient_email": row["recipient_email"],
                        "subject": row["subject"],
                        "body": row["body"],
                        "preview": row["preview"],
                        "received_at": row["received_at"],
                        "is_read": bool(row["is_read"]),
                        "is_archived": bool(row["is_archived"]),
                        "attachment": attachment,
                    }
                )
            return {"emails": emails}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{email_id}")
def get_email(email_id: int):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, sender_name, sender_email, recipient_name, recipient_email,
                       subject, body, preview, received_at, is_read, is_archived,
                       attachment_name, attachment_size, attachment_type, attachment_url
                FROM emails
                WHERE id = ?
                """,
                (email_id,),
            )
            row = cursor.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Email not found")
            attachment = None
            if row["attachment_name"]:
                attachment = {
                    "file_name": row["attachment_name"],
                    "file_size": row["attachment_size"],
                    "file_type": row["attachment_type"],
                    "download_url": row["attachment_url"],
                }
            return {
                "id": row["id"],
                "sender_name": row["sender_name"],
                "sender_email": row["sender_email"],
                "recipient_name": row["recipient_name"],
                "recipient_email": row["recipient_email"],
                "subject": row["subject"],
                "body": row["body"],
                "preview": row["preview"],
                "received_at": row["received_at"],
                "is_read": bool(row["is_read"]),
                "is_archived": bool(row["is_archived"]),
                "attachment": attachment,
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("", status_code=201)
def create_email(email: EmailCreate):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            attachment_name = email.attachment.file_name if email.attachment else None
            attachment_size = email.attachment.file_size if email.attachment else None
            attachment_type = email.attachment.file_type if email.attachment else None
            attachment_url = email.attachment.download_url if email.attachment else None
            cursor.execute(
                """
                INSERT INTO emails (
                    sender_name, sender_email, recipient_name, recipient_email,
                    subject, body, preview, received_at, is_read, is_archived,
                    attachment_name, attachment_size, attachment_type, attachment_url
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    email.sender_name,
                    email.sender_email,
                    email.recipient_name,
                    email.recipient_email,
                    email.subject,
                    email.body,
                    email.preview,
                    email.received_at.isoformat(),
                    int(email.is_read),
                    int(email.is_archived),
                    attachment_name,
                    attachment_size,
                    attachment_type,
                    attachment_url,
                ),
            )
            email_id = cursor.lastrowid
            return {
                "id": email_id,
                **email.model_dump(),
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{email_id}")
def update_email(email_id: int, email: EmailUpdate):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM emails WHERE id = ?", (email_id,))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Email not found")
            fields = []
            values = []
            if email.is_read is not None:
                fields.append("is_read = ?")
                values.append(int(email.is_read))
            if email.is_archived is not None:
                fields.append("is_archived = ?")
                values.append(int(email.is_archived))
            if not fields:
                raise HTTPException(status_code=400, detail="No fields to update")
            values.append(email_id)
            cursor.execute(f"UPDATE emails SET {', '.join(fields)} WHERE id = ?", values)
            cursor.execute(
                """
                SELECT id, sender_name, sender_email, recipient_name, recipient_email,
                       subject, body, preview, received_at, is_read, is_archived,
                       attachment_name, attachment_size, attachment_type, attachment_url
                FROM emails
                WHERE id = ?
                """,
                (email_id,),
            )
            row = cursor.fetchone()
            attachment = None
            if row["attachment_name"]:
                attachment = {
                    "file_name": row["attachment_name"],
                    "file_size": row["attachment_size"],
                    "file_type": row["attachment_type"],
                    "download_url": row["attachment_url"],
                }
            return {
                "id": row["id"],
                "sender_name": row["sender_name"],
                "sender_email": row["sender_email"],
                "recipient_name": row["recipient_name"],
                "recipient_email": row["recipient_email"],
                "subject": row["subject"],
                "body": row["body"],
                "preview": row["preview"],
                "received_at": row["received_at"],
                "is_read": bool(row["is_read"]),
                "is_archived": bool(row["is_archived"]),
                "attachment": attachment,
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{email_id}", status_code=204)
def delete_email(email_id: int):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM emails WHERE id = ?", (email_id,))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Email not found")
            cursor.execute("DELETE FROM emails WHERE id = ?", (email_id,))
            return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")