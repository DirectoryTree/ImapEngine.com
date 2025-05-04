---
title: Installation
nextjs:
  metadata:
    title: Laravel Installation - ImapEngine
    description: Learn how to install and configure the ImapEngine Laravel package in your Laravel application.
---

## Requirements

The ImapEngine Laravel package requires:

- PHP 8.1 or higher
- Laravel 10.0 or higher

## Installation

You may install the ImapEngine Laravel package via Composer:

```bash
composer require directorytree/imapengine-laravel
```

## Publishing the Configuration

After installation, you should publish the package configuration file using the `vendor:publish` Artisan command:


This will create a `config/imap.php` configuration file in your application.

## Configuration

After publishing the configuration, you can configure your IMAP mailboxes in the `config/imap.php` file:

```php
return [
    'mailboxes' => [
        'default' => [
            // ...
        ],

        // You can define additional mailboxes here
        // 'work' => [
        //     'port' => env('WORK_IMAP_PORT', 993),
        //     'host' => env('WORK_IMAP_HOST'),
        //     // ...
        // ],
    ],
];
```

## Environment Variables

If you application only interacts with one mailbox, you 
may configure it in your `.env` file:

```dotenv
IMAP_HOST=imap.example.com
IMAP_PORT=993
IMAP_USERNAME=your-username
IMAP_PASSWORD=your-password
IMAP_ENCRYPTION=ssl
```

## Next Steps

Now that you've installed and configured the ImapEngine Laravel package, check out the [Usage Guide](/docs/laravel/usage) to learn how to use it in your Laravel application.
