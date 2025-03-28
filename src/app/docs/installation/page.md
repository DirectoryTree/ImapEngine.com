---
title: Installation
nextjs:
  metadata:
    title: Installation - ImapEngine
    description: Learn how to install ImapEngine in your PHP project. Follow our step-by-step guide for both Composer and manual installation methods.
---

## Requirements

ImapEngine requires PHP 8.1 or higher.

## Installation

You may install ImapEngine via Composer:

```bash
composer require directorytree/imapengine
```

## Configuration

After installation, you'll need to configure your IMAP connection. Here's a basic example:

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    'port' => 993,
    'username' => 'your-username',
    'password' => 'your-password',
    'encryption' => 'ssl',
    'host' => 'imap.example.com',
]);
```

For more detailed configuration options and examples, check out the [Usage Guide](/docs/usage/connecting).
