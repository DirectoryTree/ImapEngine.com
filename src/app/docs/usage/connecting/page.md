---
title: Connecting
nextjs:
  metadata:
    title: Connecting to Mailboxes - ImapEngine
    description: Learn how to connect to IMAP mailboxes using ImapEngine. Discover different connection methods including basic, OAuth, and STARTTLS connections.
---

ImapEngine provides a simple way to connect to IMAP mailboxes. Here's how to get started:

## Basic Connection

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

## OAuth Connection

To connect using an OAuth token, pass the token as the password and set the authentication method to 'oauth':

```php
use DirectoryTree\ImapEngine\Mailbox;

$token = 'your-oauth-token';

$mailbox = new Mailbox([
    'port' => 993,
    'username' => 'your-username',
    'password' => $token,
    'encryption' => 'ssl',
    'authentication' => 'oauth',
    'host' => 'imap.example.com',
]);
```

## STARTTLS Connection

To connect using STARTTLS (without encryption), set the encryption option to 'starttls':

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    'port' => 143,
    'encryption' => 'starttls',
    'username' => 'your-username',
    'password' => 'your-password',
    'host' => 'imap.example.com',
]);
```

## Advanced Configuration

ImapEngine supports many configuration options for fine-tuning your connection:

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    'port' => 993,
    'host' => 'imap.example.com',
    'timeout' => 30,
    'debug' => false,
    'username' => 'your-username',
    'password' => 'your-password',
    'encryption' => 'ssl',
    'validate_cert' => true,
    'authentication' => 'plain',
    'proxy' => [
        'socket' => null,
        'username' => null,
        'password' => null,
        'request_fulluri' => false,
    ],
]);
```

### Configuration Options

| Option         | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| port           | int    | The port number to connect to              |
| host           | string | The hostname of the IMAP server            |
| timeout        | int    | Connection timeout in seconds              |
| debug          | bool   | Enable debug logging                       |
| username       | string | Your IMAP username                         |
| password       | string | Your IMAP password or OAuth token          |
| encryption     | string | Encryption method ('ssl' or 'starttls')    |
| validate_cert  | bool   | Whether to validate SSL certificates       |
| authentication | string | Authentication method ('plain' or 'oauth') |
| proxy          | array  | Proxy configuration options                |

## Debugging

The `debug` configuration option controls logging behavior for the mailbox. It accepts the following values:

- `false` (Default) - Disables debugging output
- `true` - Enables debugging using an `EchoLogger`
- `LoggerInterface` - Use a custom logger implementing PSR-3

Example with custom logger:

```php
use Psr\Log\LoggerInterface;
use DirectoryTree\ImapEngine\Mailbox;

class CustomLogger implements LoggerInterface {
    // Implement logger methods
}

$logger = new CustomLogger();

$mailbox = new Mailbox([
    'debug' => $logger,
    // ... other options
]);
```
