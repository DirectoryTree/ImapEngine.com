---
title: Installation
nextjs:
  metadata:
    title: Installation - ImapEngine
    description: Learn how to install ImapEngine in your PHP project. Follow our step-by-step guide for both Composer and manual installation methods.
---

## Requirements

ImapEngine requires PHP 8.1 or higher.

## Installation via Composer

The recommended way to install ImapEngine is through Composer:

```bash
composer require directorytree/imapengine
```

## Manual Installation

If you prefer to install ImapEngine manually, you can download the latest release from GitHub and include it in your project:

1. Download the latest release from [GitHub](https://github.com/DirectoryTree/ImapEngine/releases)
2. Extract the files to your project
3. Include the autoloader in your PHP file:

```php
require_once 'path/to/imapengine/autoload.php';
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

For more detailed configuration options and examples, check out our [Usage Guide](/docs/usage/connecting).
