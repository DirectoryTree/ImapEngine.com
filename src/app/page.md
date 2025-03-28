---
title: ImapEngine
---

A simple, fluent API for managing IMAP mailboxes in PHP without the PHP extension. {% .lead %}

{% quick-links %}

{% quick-link title="Installation" icon="installation" href="/docs/installation" description="Learn how to install ImapEngine in your PHP project." /%}

{% quick-link title="Connecting" icon="presets" href="/docs/usage/connecting" description="Learn how to connect to your IMAP server." /%}

{% quick-link title="Retrieving Messages" icon="plugins" href="/docs/usage/retrieving-messages" description="Learn how to retrieve and work with email messages." /%}

{% quick-link title="Real Time Monitoring" icon="theming" href="/docs/usage/real-time-monitoring" description="Monitor your mailbox in real-time for new messages." /%}

{% /quick-links %}

ImapEngine provides a simple, fluent API for managing IMAP mailboxes in PHP without requiring the PHP IMAP extension. It's perfect for applications that need to interact with email servers but can't or don't want to use the PHP IMAP extension.

---

## Quick start

Get started with ImapEngine in your PHP project in just a few minutes.

### Installing dependencies

Install ImapEngine using Composer:

```shell
composer require directorytree/imapengine
```

### Basic usage

Here's a simple example of how to use ImapEngine:

```php
use DirectoryTree\ImapEngine\ImapEngine;

$imap = new ImapEngine([
    'host' => 'imap.example.com',
    'port' => 993,
    'encryption' => 'ssl',
    'username' => 'user@example.com',
    'password' => 'password'
]);

// Get all folders
$folders = $imap->folders()->get();

// Get the inbox folder
$inbox = $imap->folders->inbox();

// Get all messages in the inbox
$messages = $inbox->messages()->get();
```

---

## Features

ImapEngine provides a rich set of features for working with IMAP mailboxes:

- Simple, fluent API
- No PHP IMAP extension required
- Support for all major IMAP operations
- Real-time mailbox monitoring
- Message creation and manipulation
- Folder management
- Attachment handling

{% callout title="Getting Started" %}
Check out our [installation guide](/docs/installation) to get started with ImapEngine in your project.
{% /callout %}

---

## Getting help

Need help with ImapEngine? Here are some resources:

### Documentation

- [Installation Guide](/docs/installation)
- [Connecting to IMAP](/docs/usage/connecting)
- [Working with Messages](/docs/usage/messages)
- [Real-time Monitoring](/docs/usage/monitoring)

### Support

- [GitHub Issues](https://github.com/DirectoryTree/ImapEngine/issues)
- [GitHub Discussions](https://github.com/DirectoryTree/ImapEngine/discussions)
