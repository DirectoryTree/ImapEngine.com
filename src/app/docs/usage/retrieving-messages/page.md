---
title: Retrieving Messages
nextjs:
  metadata:
    title: Retrieving Messages - ImapEngine
    description: Learn how to retrieve and filter email messages using ImapEngine. Discover how to search, paginate, and access message properties in your PHP application.
---

ImapEngine provides a powerful way to retrieve and work with email messages. Here's how to get started:

## Basic Message Retrieval

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    // ... connection options
]);

// Get all messages from the inbox
$messages = $mailbox->inbox()->messages();

// Get messages from a specific folder
$messages = $mailbox->folder('Sent')->messages();
```

## Filtering Messages

ImapEngine supports various ways to filter messages:

### By Search Criteria

```php
// Search for messages from a specific sender
$messages = $mailbox->inbox()->messages()->from('example@domain.com');

// Search for messages with specific subject
$messages = $mailbox->inbox()->messages()->subject('Meeting');

// Search for messages with attachments
$messages = $mailbox->inbox()->messages()->hasAttachments();

// Search for unread messages
$messages = $mailbox->inbox()->messages()->unread();
```

### By Date Range

```php
// Get messages from the last 7 days
$messages = $mailbox->inbox()->messages()->since('7 days ago');

// Get messages between specific dates
$messages = $mailbox->inbox()->messages()
    ->since('2024-01-01')
    ->before('2024-02-01');
```

### By Message Flags

```php
// Get flagged messages
$messages = $mailbox->inbox()->messages()->flagged();

// Get answered messages
$messages = $mailbox->inbox()->messages()->answered();

// Get deleted messages
$messages = $mailbox->inbox()->messages()->deleted();
```

## Pagination

ImapEngine supports pagination for large message sets:

```php
// Get first 10 messages
$messages = $mailbox->inbox()->messages()->limit(10);

// Get messages 11-20
$messages = $mailbox->inbox()->messages()->offset(10)->limit(10);
```

## Message Properties

Each message object provides access to various properties:

```php
$message = $mailbox->inbox()->messages()->first();

// Get message subject
$subject = $message->subject();

// Get message body
$body = $message->body();

// Get message headers
$headers = $message->headers();

// Get message date
$date = $message->date();

// Get message size
$size = $message->size();

// Get message flags
$flags = $message->flags();

// Get message attachments
$attachments = $message->attachments();
```

## Next Steps

Now that you know how to retrieve messages, you can:

- [Interact with Messages](/docs/usage/interacting-with-messages)
- [Create Draft Messages](/docs/usage/creating-draft-messages)
- [Monitor Mailboxes in Real-Time](/docs/usage/real-time-monitoring)
