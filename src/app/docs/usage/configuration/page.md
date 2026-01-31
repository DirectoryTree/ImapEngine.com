---
title: Configuration
nextjs:
    metadata:
        title: Configuring Mailbox Connection - ImapEngine
        description: Learn how to configure the connection to IMAP mailboxes using ImapEngine
---

To connect to an IMAP mailbox, create a new `Mailbox` instance with your connection configuration:

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

To connect using STARTTLS, set the encryption option to 'starttls' and use port 143:

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

## Unencrypted Connection

To connect without encryption, set the `encryption` option to `null` and use the standard unencrypted port (typically
143):

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    'port' => 143,
    'encryption' => null,
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

| Option         | Type   | Description                                                        |
|----------------|--------|--------------------------------------------------------------------|
| `port`           | int    | The port number to connect to                                      |
| `host`           | string | The hostname of the IMAP server                                    |
| `timeout`        | int    | Connection timeout in seconds                                      |
| `debug`          | bool   | Enable debug logging                                               |
| `username`       | string | Your IMAP username                                                 |
| `password`       | string | Your IMAP password or OAuth token                                  |
| `encryption`     | string | Encryption method ('ssl', 'starttls', or `null` for no encryption) |
| `validate_cert`  | bool   | Whether to validate SSL certificates                               |
| `authentication` | string | Authentication method ('plain' or 'oauth')                         |
| `proxy`          | array  | Proxy configuration options                                        |

## Debugging

The `debug` configuration option controls logging behavior for the mailbox.

### Boolean

- `false` – (Default) Disables debugging output
- `true` – Enables debugging using an `EchoLogger`, which outputs debug messages to the console

```php
use DirectoryTree\ImapEngine\Mailbox;

// No debug output.
$mailbox = new Mailbox([
    // ...
    'debug' => false,
]);

// Output debug messages to the console.
$mailbox = new Mailbox([
    // ...
    'debug' => true,
]);
```

### String

When set to a file path (e.g., `'/path/to/log/file.log'`), a `FileLogger` is instantiated to write debug messages to the specified file.

```php
use DirectoryTree\ImapEngine\Mailbox;

// Output debug messages to a file.
$mailbox = new Mailbox([
    // ...
    'debug' => '/path/to/log/file.log',
]);
```

### Class Name

If provided with a fully-qualified class name (and the class exists), an instance of that logger will be created and  used.

The class must implement `LoggerInterface`.

```php
namespace App\Loggers;

use DirectoryTree\ImapEngine\Connection\Loggers\LoggerInterface;

class CustomLogger implements LoggerInterface
{
    /**
     * Log when a message is sent.
     */
    public function sent(string $message): void
    {
        // Log the sent message...
    }

    /**
     * Log when a message is received.
     */
    public function received(string $message): void
    {
        // Log the received message...
    }
}
```

```php
use App\Loggers\CustomLogger;
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    // ...
    'debug' => CustomLogger::class,
]);
```

Or, if you use [Spatie Ray](https://spatie.be/products/ray), you may use the built in `RayLogger`:

```php
use DirectoryTree\ImapEngine\Mailbox;
use DirectoryTree\ImapEngine\Connection\Loggers\RayLogger;

$mailbox = new Mailbox([
    // ...
    'debug' => RayLogger::class,
]);
```
