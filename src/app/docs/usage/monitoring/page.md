---
title: Real Time Monitoring
nextjs:
  metadata:
    title: Real Time Monitoring - ImapEngine
    description: Learn how to monitor IMAP mailboxes in real-time using ImapEngine
---

ImapEngine supports real-time monitoring of folders using two different approaches: **IDLE** (push-based) and **Long Polling** (pull-based). Choose the method that best fits your IMAP server's capabilities and your application's needs.

## Using IDLE (Recommended)

The IDLE method uses the IMAP IDLE command to receive push notifications from the server when new messages arrive. This is the most efficient approach as it doesn't require repeated polling.

{% callout type="note" title="Server Support Required" %}
The IDLE method requires your IMAP server to support the `IDLE` capability. Most modern IMAP servers support this feature.
{% /callout %}

### Awaiting Messages

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
The `idle()` method is fully blocking. This means it enters an infinite loop when called.
Consider running it in a background process or a worker when used in a web application.
{% /callout %}

### Fetching Message Content

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
You must return the `MessageQuery` instance in the callback.
{% /callout %}

### Custom Timeouts

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

## Using Long Polling

If your IMAP server doesn't support the IDLE capability, or if you prefer a polling-based approach, you can use the `poll()` method. This method periodically checks for new messages at a specified frequency.

### Starting the Poller

To begin polling for new messages, call the `poll` method on a `Folder`:

```php
use DirectoryTree\ImapEngine\Message;

// Get the inbox folder
$inbox = $mailbox->inbox();

// Begin polling the inbox folder every 60 seconds.
$inbox->poll(function (Message $message) {
    // Do something with the newly received message
});
```

{% callout type="warning" title="Important" %}
Like `idle()`, the `poll()` method is fully blocking and enters an infinite loop.
Consider running it in a background process or a worker when used in a web application.
{% /callout %}

### How It Works

The polling mechanism works by:

1. On the first check, it records the UID of the most recent message in the folder
2. On subsequent checks, it searches for messages with UIDs greater than the last seen UID
3. New messages are passed to your callback function
4. The poller sleeps for the specified frequency before checking again

This ensures that only new messages are processed, avoiding duplicate processing.

### Fetching Message Content

Just like with IDLE, you can configure the query used to fetch newly received messages using the second argument:

```php
use DirectoryTree\ImapEngine\MessageQuery;

$inbox->poll(function (Message $message) {
    // Handle new message...
}, function (MessageQuery $query) {
    // Adjust the query to fetch all message content...
    return $query->withBody()
        ->withHeaders()
        ->withFlags();
});
```

{% callout type="warning" title="Important" %}
You must return the `MessageQuery` instance in the callback.
{% /callout %}

### Custom Frequency

By default, the poller checks for new messages every 60 seconds. You can customize this frequency using the third parameter:

```php
use DirectoryTree\ImapEngine\MessageQuery;

// Using parameter name:
$inbox->poll(function (Message $message) {
    // Handle new message...
}, frequency: 30); // Check every 30 seconds

// With a query callback:
$inbox->poll(function (Message $message) {
    // Handle new message...
}, function (MessageQuery $query) {
    // Customize the query...
}, 30); // Check every 30 seconds
```

{% callout type="note" title="Performance Consideration" %}
Be mindful of the polling frequency. Polling too frequently can put unnecessary load on your IMAP server and may result in rate limiting. A frequency of 30-60 seconds is typically a good balance.
{% /callout %}

### Stopping the Poller

To stop polling, you can return `false` from the frequency parameter by using a closure:

```php
$shouldContinue = true;

$inbox->poll(
    function (Message $message) use (&$shouldContinue) {
        // Process message...

        // Stop polling after processing a specific message
        if ($message->subject() === 'Stop') {
            $shouldContinue = false;
        }
    },
    frequency: function () use (&$shouldContinue) {
        return $shouldContinue ? 60 : false;
    }
);
```

## Choosing Between IDLE and Polling

Use **IDLE** when:
- Your IMAP server supports the IDLE capability
- You need real-time notifications with minimal delay
- You want to minimize server load and network traffic

Use **Long Polling** when:
- Your IMAP server doesn't support IDLE
- You need more control over the checking frequency
- You're working with servers that have connection timeout issues with IDLE
