---
title: Real Time Monitoring
nextjs:
  metadata:
    title: Real Time Monitoring - ImapEngine
    description: Learn how to monitor IMAP mailboxes in real-time using ImapEngine
---

ImapEngine supports real-time monitoring of folders via the IMAP IDLE command. This lets you listen for new messages as they arrive without polling repeatedly.

## Awaiting Messages

To begin awaiting new messages, you may call the `idle` method on a `Folder`:

```php
use DirectoryTree\ImapEngine\Message;

// Get the inbox folder
$inbox = $mailbox->inbox();

// Begin idling on the inbox folder.
$inbox->idle(function (Message $message) {
    // Do something with the newly received message
});
```

{% callout type="warning" title="Important" %}
The `idle()` method is fully blocking (as in, it enters an infinite loop), so consider running it in a background process or a worker when used in a web application.
{% /callout %}

## Fetching Message Content

By default, messages received in idle will not be fetched with all of their content (flags, headers, and body with attachments).

If you need to fetch the message content, you may configure the query that is used to fetch newly received messages using the second argument of the `idle()` method:

```php
use DirectoryTree\ImapEngine\MessageQuery;

$inbox->idle(function (Message $message) {
    // Handle new message...
}, function (MessageQuery $query) {
    // Adjust the query to fetch all message content...
    return $query->withBody()
        ->withHeaders()
        ->withFlags();
});
```

{% callout type="warning" title="Important" %}
You must return the `MessageQuery` from the callback.
{% /callout %}

## Custom Timeouts

If your IMAP server requires a specific timeout, you may specify one in the third parameter (or using the parameter name):

```php
use DirectoryTree\ImapEngine\MessageQuery;

// Using parameter name:
$inbox->idle(function (Message $message) {
    // Handle new message...
}, timeout: 1200); // 20 minutes

// With a query callback:
$inbox->idle(function (Message $message) {
    // Handle new message...
}, function (MessageQuery $query) {
    // Customize the query...
}, 1200); // 20 minutes
```
