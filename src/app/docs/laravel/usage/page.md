---
title: Usage
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

You can fake a mailbox for testing:

```php
use DirectoryTree\ImapEngine\Laravel\Facades\Imap;
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMessage;

// Fake the default mailbox
$fake = Imap::fake('default');

// Add a fake folder
$folder = $fake->addFolder(new FakeFolder('INBOX'));

// Add a fake message to the folder
$folder->addMessage(
    new FakeMessage([
        'uid' => 1,
        'subject' => 'Test Subject',
        'from' => 'sender@example.com',
        'to' => 'recipient@example.com',
        'body' => 'This is a test message',
    ])
);

// Now you can use the mailbox in your tests
$mailbox = Imap::mailbox('default');
$inbox = $mailbox->inbox();
$messages = $inbox->messages()->get();

// Assert that there is one message
$this->assertCount(1, $messages);
```

### Faking Capabilities

You can also fake mailbox capabilities:

```php
// Fake the mailbox with specific capabilities
$fake = Imap::fake('default', [], [], ['IMAP4rev1', 'IDLE', 'UIDPLUS']);

// Check if a capability is supported
$mailbox = Imap::mailbox('default');
$this->assertTrue($mailbox->hasCapability('IDLE'));
```

## Advanced Usage

### Accessing the ImapManager

If you need more control, you can inject the `ImapManager` class:

```php
use DirectoryTree\ImapEngine\Laravel\ImapManager;

class EmailService
{
    protected $manager;
    
    public function __construct(ImapManager $manager)
    {
        $this->manager = $manager;
    }
    
    public function getMailbox($name)
    {
        return $this->manager->mailbox($name);
    }
}
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

This is useful when you want to force the manager to create a fresh instance on the next access.
