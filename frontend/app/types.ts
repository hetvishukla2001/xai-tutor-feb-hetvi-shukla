export type Attachment = {
    file_name: string;
    file_size: string;
    file_type: string;
    download_url?: string | null;
  };
  
  export type Email = {
    id: number;
    sender_name: string;
    sender_email: string;
    recipient_name: string;
    recipient_email: string;
    subject: string;
    body: string;
    preview: string;
    received_at: string;
    is_read: boolean;
    is_archived: boolean;
    attachment?: Attachment | null;
  };