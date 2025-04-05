---
title: Mbox Parsing
nextjs:
    metadata:
        title: Interacting with Mbox Files - ImapEngine
        description: Learn how to parse .mbox files and retrieve their email messages using ImapEngine
---

ImapEngine provides support for parsing and reading local Mbox files through the `DirectoryTree\ImapEngine\Mbox` class. 
This allows you to interact with email messages stored locally in an Mbox file, rather than via an IMAP server.

## Retrieving Messages from an Mbox File

To get started, instantiate the `Mbox` class by providing the path to your Mbox file. For example:

```php
use DirectoryTree\ImapEngine\Mbox;

$mbox = new Mbox('/home/username/mail/stevebauman.mbox');

/** @var \DirectoryTree\ImapEngine\FileMessage $message */
foreach ($mbox->messages() as $message) {
    // Work with each FileMessage instance.
}
```

### How It Works

When you call the `messages()` method, an internal file handle to your Mbox file is opened and each message is read and `yield`ed back as a `FileMessage` instance. 

This approach makes it possible to process the file message-by-message rather than loading the entire Mbox file into memory at once.

## Custom Delimiters

By default, the Mbox class uses a regular expression delimiter to detect new messages. If your Mbox file uses a different format or requires a custom delimiter, you can override it:

```php
$mbox = new Mbox('/home/username/mail/stevebauman.mbox');

// Provide a custom delimiter.
$messages = $mbox->messages(
    delimiter: '/^From\\s+someCustomRegexHere/'
);
```

## Interacting with File Messages

Every message read from the Mbox file is returned as an instance of `DirectoryTree\ImapEngine\FileMessage`. This class is designed to parse the raw email data and provide convenient methods to access the message’s body, headers, attachments, and more.

### Basic Usage

```php
/** @var \DirectoryTree\ImapEngine\FileMessage $message */
foreach ($mbox->messages() as $message) {
    // Get the raw contents of the message:
    $raw = $message->raw();

    // Check if the message has a body:
    if ($message->hasBody()) {
        // Retrieve the message body.
        $body = $message->body();
    }

    // Retrieve headers (if available):
    $headers = $message->headers();

    // Retrieve attachments:
    foreach ($message->attachments() as $attachment) {
        // Work with each attachment.
        $attachmentContents = $attachment->contents();
    }
}
```

{% callout title="Note" %}
The `uid()` method will throw an exception if you attempt to call it on the `FileMessage` instance. 
This is because UIDs originate from IMAP servers, and are not exported in Mbox files.
{% /callout %}
