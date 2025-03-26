---
title: Creating Draft Messages
nextjs:
  metadata:
    title: Creating Draft Messages - ImapEngine
    description: Learn how to create and manage draft email messages using ImapEngine. Discover how to compose, save, and send draft messages in your PHP application.
---

ImapEngine allows you to create draft messages and save them to the server for later editing or sending. Here's how to get started:

## Creating a Draft Message

To create a new draft message, you may use the `append()` method on a folder instance:

```php
use DirectoryTree\ImapEngine\DraftMessage;

$uid = $inbox->messages()->append(
    new DraftMessage(
        from: 'foo@email.com',
        to: 'bar@email.com',
        subject: 'Hello World',
        text: 'This is the message body.',
        html: '<p>This is the message body.</p>',
    )
);
```

## Adding Attachments

Draft messages also accept attachments:

```php
$inbox->messages()->append(
    new DraftMessage(
        from: 'foo@email.com',
        to: 'bar@email.com',
        subject: 'Hello World',
        text: 'This is the message body.',
        html: '<p>This is the message body.</p>',
        attachments: [
            '/path/to/attachment.pdf',
            '/path/to/another-attachment.jpg',
        ]
    )
);
```

## Working with Draft Messages

### Setting Message Properties

```php
$draft = new DraftMessage();

// Set recipients
$draft->to('recipient@example.com');
$draft->cc('cc@example.com');
$draft->bcc('bcc@example.com');

// Set subject
$draft->subject('Meeting Tomorrow');

// Set body
$draft->body('Hi, let\'s meet tomorrow at 2 PM.');

// Set HTML body
$draft->html('<p>Hi, let\'s meet tomorrow at 2 PM.</p>');

// Set plain text body
$draft->text('Hi, let\'s meet tomorrow at 2 PM.');
```

### Adding Attachments

```php
$draft = new DraftMessage();

// Add file attachment
$draft->attach('path/to/file.pdf');

// Add attachment from string
$draft->attachFromString('content', 'filename.txt');

// Add attachment from URL
$draft->attachFromUrl('https://example.com/file.pdf');
```

### Managing Drafts

```php
// Save draft
$draft->save();

// Update draft
$draft->subject('Updated Subject')->save();

// Delete draft
$draft->delete();

// Send draft
$draft->send();
```

## Working with Existing Drafts

### Retrieving Drafts

```php
// Get all drafts
$drafts = $mailbox->folder('Drafts')->messages();

// Get specific draft
$draft = $mailbox->folder('Drafts')->messages()->first();
```

### Editing Drafts

```php
$draft = $mailbox->folder('Drafts')->messages()->first();

// Update draft content
$draft->subject('Updated Subject')
    ->body('Updated body content')
    ->save();

// Add attachment to existing draft
$draft->attach('path/to/file.pdf')->save();
```
