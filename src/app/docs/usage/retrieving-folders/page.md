---
title: Retrieving Folders
nextjs:
  metadata:
    title: Retrieving Folders - ImapEngine
    description: Learn how to work with IMAP folders using ImapEngine. Discover how to list, create, delete, and manage email folders in your PHP application.
---

ImapEngine provides a simple way to work with IMAP folders. Here's how to get started:

## Getting All Folders

```php
use DirectoryTree\ImapEngine\Mailbox;

$mailbox = new Mailbox([
    // ... connection options
]);

// Get all folders
$folders = $mailbox->folders();
```

## Getting a Specific Folder

```php
// Get the inbox folder
$inbox = $mailbox->inbox();

// Get a specific folder by name
$folder = $mailbox->folder('Sent');
```

## Folder Operations

### Creating Folders

```php
// Create a new folder
$mailbox->createFolder('Archive');
```

### Deleting Folders

```php
// Delete a folder
$mailbox->deleteFolder('Archive');
```

### Renaming Folders

```php
// Rename a folder
$mailbox->renameFolder('OldName', 'NewName');
```

### Moving Messages Between Folders

```php
// Move a message to another folder
$message->move('Archive');

// Copy a message to another folder
$message->copy('Archive');
```

## Folder Properties

Each folder object provides access to various properties:

```php
$folder = $mailbox->folder('Inbox');

// Get folder name
$name = $folder->name();

// Get folder delimiter
$delimiter = $folder->delimiter();

// Get folder attributes
$attributes = $folder->attributes();

// Get message count
$count = $folder->messageCount();

// Get recent message count
$recent = $folder->recentCount();
```

## Working with Subfolders

ImapEngine supports working with nested folder structures:

```php
// Get a subfolder
$subfolder = $mailbox->folder('Parent/Child');

// Create a subfolder
$mailbox->createFolder('Parent/Child');

// List all subfolders
$subfolders = $mailbox->folders('Parent');
```
