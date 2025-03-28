---
title: Retrieving Folders
nextjs:
  metadata:
    title: Retrieving Folders - ImapEngine
    description: Learn how to retrieve and interact with IMAP folders using ImapEngine
---

To retrieve folders from an IMAP mailbox, you may use the `folders()` method on the `Mailbox` instance.

This method returns a `FolderRespository` instance, which provides operations for retrieving, creating, and managing folders:

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    // ...
]);

// Get all folders.
$folders = $mailbox->folders()->get();

// Get folders matching a glob pattern.
$folders = $mailbox->folders()->get('*/Subfolder');
```

## Getting a Specific Folder

To retrieve a specific folder, you may use the `find()` method on the `FolderRepository` instance:

{% callout title="Note" %}
Since an `INBOX` folder is mandatory for all IMAP connections, ImapEngine provides a shortcut method to retrieve it directly from the `Mailbox` instance via the `inbox` method.
{% /callout %}

```php
// Get the inbox folder.
$inbox = $mailbox->inbox();

// Find a specific folder by name.
$folder = $mailbox->folders()->find('Sent');

// Find a folder or fail (throw an exception).
$folder = $mailbox->folders()->findOrFail('Important');
```

## Creating Folders

You may create a new folder using the `create()` method:

```php
$folder = $mailbox->folders()->create('Archive');
```

To create a nested folder, separate the parent and child folder names with your IMAP server’s folder delimiter:

{% callout title="Note" %}
In most cases the folder delimiter is a forward slash (`/`), but it may vary depending on the IMAP server.
{% /callout %}

```php
$nestedFolder = $mailbox->folders()->create('Parent/Child');
```

## Folder Properties

Once you have a `Folder` instance, you may retrieve various properties:

```php
$folder = $mailbox->folders()->find('Inbox');

// Get the full folder path (e.g. "Inbox/Archive").
$attributes = $folder->path();

// Get the root folder name (excluding parent folders, e.g. "Inbox").
$name = $folder->name();

// Get the folder delimiter (e.g. "/").
$delimiter = $folder->delimiter();
```

## Deleting Folders

To delete a folder, call the `delete()` method on the `Folder` instance:

```php
$folder->delete();
```

## Renaming / Moving Folders

To rename a folder, use the `move()` method on the `Folder` instance:

```php
$folder->move('NewName');
```

## Working with Subfolders

You may retrieve subfolders of a folder using the `get()` method on the `FolderRepository` instance:

```php
// Get a specific subfolder.
$subfolder = $mailbox->folders()->find('Parent/Child');

// List all subfolders within a parent.
$subfolders = $mailbox->folders()->get('Parent/*');
```

## Selecting a Folder

If you already have a `Folder` instance, you may explicitly select it on the IMAP server:

{% callout title="Note" %}
This isn't typically necessary, as ImapEngine will automatically select the folder when performing an operation that requires it.
{% /callout %}

```php
$folder->select();

// Or force re-selection
$folder->select(true);
```

Selecting a folder tells the server that you want to work with the messages within that folder.

## Checking Folder Status

You may retrieve status information for a folder, such as the number of messages, recent messages, and unseen messages:

```php
$status = $folder->status(); // array
```

This data includes various IMAP-defined keys (e.g. `MESSAGES`, `RECENT`, `UIDNEXT`, etc.).

## Examining a Folder

Examining a folder retrieves additional details in a read-only manner:

```php
$details = $folder->examine(); // array
```

Use `examine()` if you want to inspect a folder’s metadata without marking messages as read.

## Expunging Messages

After marking a message for deletion via `$message->delete()`, you may call `expunge` on the folder to permanently remove them.

When a folder is expunged, the IMAP server removes all messages marked for deletion:

```php
use DirectoryTree\ImapEngine\Message;

// Get the inbox folder.
$inbox = $mailbox->folders()->inbox();

// Get all messages in the inbox.
$messages = $inbox->messages()->get();

// Mark each message for deletion.
$messages->each(
    fn (Message $message) => $message->delete()
);

// Permanently remove the deleted messages.
$folder->expunge();
```

Alternatively, you may pass in `true` into the first parameter of the `delete()` method on the `Message` instance to expunge the message immediately:

{% callout title="Note" %}
If you're performing mass deletions, it's more efficient to call `expunge()` once after marking all messages for deletion.
{% /callout %}

```php
$message = $inbox->messages()->first();

// Immediately delete and expunge the message.
$message->delete(expunge: true);
```

