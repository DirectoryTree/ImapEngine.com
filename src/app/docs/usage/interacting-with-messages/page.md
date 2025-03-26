---
title: Interacting with Messages
nextjs:
  metadata:
    title: Interacting with Messages - ImapEngine
    description: Learn how to interact with email messages using ImapEngine. Discover how to manage message flags, work with attachments, and handle message content.
---

ImapEngine provides a rich set of methods to interact with email messages. Here's how to get started:

## Message Flags

### Setting Flags

```php
$message = $mailbox->inbox()->messages()->first();

// Mark as read
$message->markAsRead();

// Mark as unread
$message->markAsUnread();

// Flag message
$message->flag();

// Unflag message
$message->unflag();

// Mark as answered
$message->markAsAnswered();

// Mark as deleted
$message->markAsDeleted();
```

### Checking Flags

```php
$message = $mailbox->inbox()->messages()->first();

// Check if message is read
$isRead = $message->isRead();

// Check if message is flagged
$isFlagged = $message->isFlagged();

// Check if message is answered
$isAnswered = $message->isAnswered();

// Check if message is deleted
$isDeleted = $message->isDeleted();
```

## Message Content

### Working with Attachments

```php
$message = $mailbox->inbox()->messages()->first();

// Get all attachments
$attachments = $message->attachments();

// Get first attachment
$attachment = $message->attachments()->first();

// Download attachment
$attachment->download('path/to/save/file.pdf');

// Get attachment content
$content = $attachment->content();

// Get attachment filename
$filename = $attachment->filename();

// Get attachment size
$size = $attachment->size();
```

### Working with Message Body

```php
$message = $mailbox->inbox()->messages()->first();

// Get HTML body
$html = $message->html();

// Get plain text body
$text = $message->text();

// Get both HTML and text
$bodies = $message->bodies();
```

## Message Headers

```php
$message = $mailbox->inbox()->messages()->first();

// Get all headers
$headers = $message->headers();

// Get specific header
$from = $message->header('from');
$to = $message->header('to');
$subject = $message->header('subject');
$date = $message->header('date');
```

## Message Structure

```php
$message = $mailbox->inbox()->messages()->first();

// Get message structure
$structure = $message->structure();

// Get message parts
$parts = $message->parts();

// Get message encoding
$encoding = $message->encoding();

// Get message charset
$charset = $message->charset();
```
