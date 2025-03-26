---
title: Real Time Monitoring
nextjs:
  metadata:
    title: Real Time Monitoring - ImapEngine
    description: Learn how to monitor IMAP mailboxes in real-time using ImapEngine. Discover how to track new messages, folder changes, and handle events in your PHP application.
---

ImapEngine provides powerful real-time monitoring capabilities for IMAP mailboxes. Here's how to get started:

## Basic Monitoring

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    // ... connection options
]);

// Start monitoring the inbox
$mailbox->inbox()->monitor(function ($message) {
    // Handle new message
    echo "New message received: " . $message->subject() . "\n";
});
```

## Advanced Monitoring

### Monitoring Multiple Folders

```php
// Monitor multiple folders
$mailbox->monitor(['Inbox', 'Sent', 'Drafts'], function ($message, $folder) {
    echo "New message in {$folder}: " . $message->subject() . "\n";
});
```

### Monitoring with Filters

```php
// Monitor only unread messages
$mailbox->inbox()->monitor(function ($message) {
    if ($message->isUnread()) {
        echo "New unread message: " . $message->subject() . "\n";
    }
});

// Monitor messages from specific sender
$mailbox->inbox()->monitor(function ($message) {
    if ($message->from() === 'important@example.com') {
        echo "Message from important sender: " . $message->subject() . "\n";
    }
});
```

### Monitoring with Timeouts

```php
// Monitor with custom timeout (in seconds)
$mailbox->inbox()->monitor(function ($message) {
    echo "New message: " . $message->subject() . "\n";
}, 30); // Check every 30 seconds
```

## Event-Based Monitoring

ImapEngine supports various events for monitoring:

### Message Events

```php
$mailbox->inbox()->monitor(function ($message, $event) {
    switch ($event) {
        case 'new':
            echo "New message received\n";
            break;
        case 'deleted':
            echo "Message deleted\n";
            break;
        case 'flagged':
            echo "Message flagged\n";
            break;
        case 'unflagged':
            echo "Message unflagged\n";
            break;
        case 'read':
            echo "Message marked as read\n";
            break;
        case 'unread':
            echo "Message marked as unread\n";
            break;
    }
});
```

### Folder Events

```php
$mailbox->monitor(function ($folder, $event) {
    switch ($event) {
        case 'created':
            echo "New folder created: {$folder}\n";
            break;
        case 'deleted':
            echo "Folder deleted: {$folder}\n";
            break;
        case 'renamed':
            echo "Folder renamed: {$folder}\n";
            break;
    }
});
```

## Error Handling

```php
$mailbox->inbox()->monitor(function ($message) {
    echo "New message: " . $message->subject() . "\n";
}, 30, function ($error) {
    echo "Error occurred: " . $error->getMessage() . "\n";
});
```

## Stopping Monitoring

```php
// Start monitoring and store the process
$process = $mailbox->inbox()->monitor(function ($message) {
    echo "New message: " . $message->subject() . "\n";
});

// Stop monitoring
$process->stop();
```

## Next Steps

Now that you know how to monitor mailboxes in real-time, you have completed the ImapEngine documentation! You can:

- Review the [Introduction](/docs/introduction) for a high-level overview
- Check the [Installation](/docs/installation) guide for setup instructions
- Explore the [Usage](/docs/usage) section for detailed examples
