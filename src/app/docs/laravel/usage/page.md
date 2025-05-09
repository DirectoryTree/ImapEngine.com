---
title: Laravel Usage
nextjs:
  metadata:
    title: Laravel Usage - ImapEngine
    description: Learn how to use the ImapEngine Laravel package in your Laravel applications. Discover how to access mailboxes, monitor for new messages, and more.
---

## Basic Usage

The ImapEngine Laravel package provides a convenient `Imap` facade for accessing your configured mailboxes.

### Accessing a Mailbox

You can access a configured mailbox using the `Imap` facade:

```php
use DirectoryTree\ImapEngine\Laravel\Facades\Imap;

// Access the default mailbox
$mailbox = Imap::mailbox('default');

// Get all folders
$folders = $mailbox->folders()->get();

// Access the inbox
$inbox = $mailbox->inbox();

// Get messages from the inbox
$messages = $inbox->messages()->get();
```

### Working with Multiple Mailboxes

If you've configured multiple mailboxes, you can access them by name:

```php
// Access the 'work' mailbox
$workMailbox = Imap::mailbox('work');

// Access the 'personal' mailbox
$personalMailbox = Imap::mailbox('personal');
```

### Creating Dynamic Mailboxes

You may create mailboxes dynamically without adding them to your configuration:

```php
use DirectoryTree\ImapEngine\Laravel\Facades\Imap;

// Create and register a mailbox dynamically
Imap::register('temporary', [
    'host' => 'imap.example.com',
    'port' => 993,
    'username' => 'username',
    'password' => 'password',
    'encryption' => 'ssl',
]);

// Access the dynamically registered mailbox
$mailbox = Imap::mailbox('temporary');
```

## Monitoring Mailboxes

The package includes an Artisan command for monitoring mailboxes for new messages.

### Watching for New Messages

You can watch a mailbox for new messages using the `imap:watch` Artisan command:

```bash
php artisan imap:watch default
```

This command will continuously monitor the default mailbox's inbox for new messages.

### Watching a Specific Folder

You can specify a folder to watch:

```bash
php artisan imap:watch default "INBOX.Sent"
```

### Loading Message Data

By default, the command only loads basic message information. You can specify additional data to load:

```bash
php artisan imap:watch default --with=flags,headers,body
```

Options include:
- `flags`: Load message flags
- `headers`: Load message headers
- `body`: Load message body

### Setting Timeout and Retry Attempts

You can configure the IDLE timeout and retry attempts:

```bash
php artisan imap:watch default --timeout=60 --attempts=10
```

## Handling New Messages

When a new message is detected, the package dispatches a `MessageReceived` event.

### Listening for New Messages

You can create a listener for the `MessageReceived` event:

```php
namespace App\Listeners;

use DirectoryTree\ImapEngine\Laravel\Events\MessageReceived;

class HandleNewEmail
{
    /**
     * Handle the event.
     */
    public function handle(MessageReceived $event): void
    {
        $message = $event->message;

        // Access message properties
        $subject = $message->subject();
        $from = $message->from();
        $body = $message->body();

        // Process the message...
    }
}
```

Register your listener in your `EventServiceProvider`:

```php
protected $listen = [
    'DirectoryTree\ImapEngine\Laravel\Events\MessageReceived' => [
        'App\Listeners\HandleNewEmail',
    ],
];
```

## Testing

The ImapEngine Laravel package includes testing helpers to make it easy to test your application without connecting to a real IMAP server.

### Faking a Mailbox

When needing to test retrieving mail from a mailbox in your application, you may use `fake` method on the `Imap` facade to create a fake mailbox instance.

When `fake` is called, a test mailbox instance will be inserted into the container, overriding the default mailbox instance.

{% callout type="warning" title="Important" %}
You should type-hint against ImapEngine's interfaces and not the concrete classes, so
that your application is compatible with whichever instance is registered in the container.
{% /callout %}

```php
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMailbox;
use DirectoryTree\ImapEngine\Laravel\Facades\Imap;

// Fake the default mailbox
$mailbox = Imap::fake(
    mailbox: 'default',
    config: ['host' => 'imap.example.com', ...],
    folders: [new FakeFolder('inbox'), new FakeFolder('sent')],
);

$inbox = $mailbox->inbox();

// Add a fake message to the folder
$inbox->addMessage(
    new FakeMessage(
        uid: 1,
        flags: ['\Seen'],
        contents: 'Hello, world.',
    )
);

// Assert that the message is present
$this->get(route('mailbox.messages.index', [
    'mailbox' => 'default',
    'folder' => 'inbox',
]))->assertSee('Hello, world.');
```

You may also add fake messages directly into the `FakeFolder` constructor using the `messages` parameter:

```php
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMessage;

$inbox = new FakeFolder(
    path: 'inbox',
    flags: ['\\Inbox'],
    messages: [
        new FakeMessage(1, ['\\Seen'], 'Message content'),
        new FakeMessage(2, ['\\Flagged'], 'Another message content'),
    ],
);
```

You may also fake mailbox capabilities using the `capabilities` parameter:

```php
$fake = Imap::fake('default', capabilities: ['IMAP4rev1', 'IDLE', 'UIDPLUS']);

$mailbox = Imap::mailbox('default');

$this->assertTrue($mailbox->hasCapability('IDLE'));
```

### Building Custom Mailboxes

You can build custom mailbox instances:

```php
use DirectoryTree\ImapEngine\Laravel\Facades\Imap;

$mailbox = Imap::build([
    'host' => 'imap.example.com',
    'port' => 993,
    'username' => 'username',
    'password' => 'password',
    'encryption' => 'ssl',
]);
```

### Swapping Mailbox Instances

You can swap out a mailbox instance with a custom one:

```php
use DirectoryTree\ImapEngine\Laravel\Facades\Imap;
use DirectoryTree\ImapEngine\Mailbox;

$customMailbox = new Mailbox([
    // Custom configuration
]);

Imap::swap('default', $customMailbox);
```

### Removing Mailboxes

You can remove a mailbox from the in-memory cache:

```php
Imap::forget('default');
```

This is useful when you want to force the manager to create a fresh instance of the mailbox the next time it's accessed.
