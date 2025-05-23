---
title: Connecting
nextjs:
  metadata:
    title: Connecting to Mailboxes - ImapEngine
    description: Learn how to connect to IMAP mailboxes using ImapEngine
---

ImapEngine will automatically attempt connecting to the mailbox when a method is called that requires connectivity:

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    // ...
]);

// Automatically connects to the mailbox.
$folders = $mailbox->folders()->get();
```

However, if you prefer to connect manually, you may use the `connect` method.

If connecting fails, an `ImapConnectionException` exception is thrown.

If authentication fails, an `ImapCommandException` exception is thrown.

```php
use DirectoryTree\ImapEngine\Mailbox;
use DirectoryTree\ImapEngine\Exceptions\ImapCommandException;
use DirectoryTree\ImapEngine\Exceptions\ImapConnectionException;

$mailbox = new Mailbox([
    // ...
]);

try {
    $mailbox->connect();
} catch (ImapCommandException $e) {
    // Handle authentication failures (invalid credentials).
} catch (ImapConnectionException $e) {
    // Handle connection failures (network, server issues).
}
```

## Checking Connection Status

You may check if the mailbox is currently connected via the `connected()` method:

```php
if ($mailbox->connected()) {
    // The mailbox is connected.
}
```

## Forcing Reconnection
If you want to forcibly reconnect—even if you’re already connected—you can call `reconnect()`:

```php
$mailbox->reconnect();
```

This internally calls `disconnect()` and then `connect()` again.

## Disconnecting
To disconnect from the mailbox at any time, you may call `disconnect()`:

```php
$mailbox->disconnect();
```

This logs out and disconnects from the server.

## Accessing the Underlying Connection

If you need low-level access to the active connection, you can retrieve it via `connection()`:

```php
// DirectoryTree\ImapEngine\Connection\ImapConnection
$connection = $mailbox->connection();
```

## Retrieving Supported Capabilities

You can see which IMAP capabilities your mailbox server supports by calling `capabilities()`:

```php
// ["IMAP4rev1", "IDLE", "UIDPLUS", ...]
$capabilities = $mailbox->capabilities();
```

## Managing Configuration
You can retrieve the entire mailbox configuration array or specific config values using `config()`:

```php
// Get the entire config.
$config = $mailbox->config();

// Get a specific config value with a default.
$port = $mailbox->config('port', 993);
```

This allows you to inspect or use configuration data at runtime.

You may use dot-notation to access nested values:

```php
$proxyUsername = $mailbox->config('proxy.username');
```