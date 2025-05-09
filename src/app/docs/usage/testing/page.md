---
title: Testing
nextjs:
  metadata:
    title: Testing with ImapEngine - ImapEngine
    description: Learn how to test your application with ImapEngine using test fakes without connecting to a real IMAP server.
---

ImapEngine provides a comprehensive set of testing utilities that allow you to test your application without connecting to a real IMAP server.

This is especially useful for unit tests and CI/CD pipelines where you want to avoid external dependencies.

## Using Test Fakes

ImapEngine includes several fake implementations of its core interfaces that you can use in your tests:

- `FakeMailbox`: A fake implementation of `MailboxInterface`
- `FakeFolder`: A fake implementation of `FolderInterface`
- `FakeMessage`: A fake implementation of `MessageInterface`
- `FakeMessageQuery`: A fake implementation of `MessageQueryInterface`
- `FakeFolderRepository`: A fake implementation of `FolderRepositoryInterface`

These classes allow you to create a complete mock of an IMAP mailbox system for testing.

## Creating a Fake Mailbox

To create a fake mailbox for testing, instantiate the `FakeMailbox` class:

```php
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMailbox;
use DirectoryTree\ImapEngine\Testing\FakeMessage;

// Create a fake mailbox with configuration
$mailbox = new FakeMailbox(
    // Configuration
    config: [
        'host' => 'imap.example.com',
        'port' => 993,
        'username' => 'test@example.com',
        'password' => 'password',
        'encryption' => 'ssl',
    ],
    // Folders
    folders: [
        new FakeFolder('inbox'),
        new FakeFolder('sent'),
        new FakeFolder('trash'),
    ],
    // Capabilities
    capabilities: ['IMAP4rev1', 'IDLE', 'UIDPLUS']
);
```

## Adding Fake Messages

You can add fake messages to folders either during initialization or afterward:

```php
// Add messages during folder initialization
$inbox = new FakeFolder(
    path: 'inbox',
    flags: ['\\Inbox'],
    messages: [
        new FakeMessage(1, ['\\Seen'], 'From: sender@example.com\r\nTo: recipient@example.com\r\nSubject: Test Email\r\n\r\nThis is a test email.'),
        new FakeMessage(2, ['\\Flagged'], 'From: another@example.com\r\nTo: recipient@example.com\r\nSubject: Important Email\r\n\r\nThis is an important email.'),
    ]
);

// Or add messages after folder creation
$inbox = new FakeFolder('inbox');

$inbox->addMessage(
    new FakeMessage(
        uid: 1,
        flags: ['\\Seen'],
        contents: 'From: sender@example.com\r\nTo: recipient@example.com\r\nSubject: Test Email\r\n\r\nThis is a test email.'
    )
);
```

## Testing with PHPUnit

Here's an example of how to use ImapEngine's testing utilities with PHPUnit:

```php
use PHPUnit\Framework\TestCase;
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMailbox;
use DirectoryTree\ImapEngine\Testing\FakeMessage;

class EmailProcessorTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a fake mailbox for testing
        $this->mailbox = new FakeMailbox(
            config: ['host' => 'imap.example.com', 'port' => 993],
            folders: [
                new FakeFolder(
                    path: 'inbox',
                    messages: [
                        new FakeMessage(
                            uid: 1,
                            flags: ['\\Seen'],
                            contents: 'From: sender@example.com\r\nTo: recipient@example.com\r\nSubject: Test Email\r\n\r\nThis is a test email.'
                        )
                    ]
                )
            ]
        );
    }
    
    public function testProcessNewEmails(): void
    {
        // Get the inbox folder
        $inbox = $this->mailbox->inbox();
        
        // Get all messages
        $messages = $inbox->messages()->get();
        
        // Assert we have one message
        $this->assertCount(1, $messages);
        
        // Assert the message has the correct subject
        $this->assertEquals('Test Email', $messages->first()->subject());
        
        // Test your email processing logic here...
    }
}
```

## Testing Message Operations

You can test various message operations using the fake implementations:

```php
public function testMarkingMessagesAsRead(): void
{
    // Get the inbox folder
    $inbox = $this->mailbox->inbox();
    
    // Add a new unread message
    $inbox->addMessage(
        new FakeMessage(
            uid: 2,
            flags: [], // No flags means unread
            contents: 'From: sender@example.com\r\nSubject: Unread Email\r\n\r\nThis is an unread email.'
        )
    );
    
    // Get the unread message
    $message = $inbox->messages()->find(2);
    
    // Assert it's not seen
    $this->assertFalse($message->isSeen());
    
    // Mark it as seen
    $message->markSeen();
    
    // Assert it's now seen
    $this->assertTrue($message->isSeen());
}
```

## Testing Folder Operations

You can also test folder operations:

```php
public function testCreatingFolders(): void
{
    // Create a new folder
    $folder = $this->mailbox->folders()->create('Archive');
    
    // Assert the folder was created
    $this->assertNotNull($this->mailbox->folders()->find('Archive'));
    
    // Add a message to the new folder
    $folder->addMessage(
        new FakeMessage(
            uid: 1,
            flags: [],
            contents: 'From: sender@example.com\r\nSubject: Archived Email\r\n\r\nThis is an archived email.'
        )
    );
    
    // Assert the message was added
    $this->assertCount(1, $folder->messages()->get());
}
```

## Testing Message Queries

You can test message queries and operations:

```php
public function testMessageQueries(): void
{
    // Get the inbox folder
    $inbox = $this->mailbox->inbox();
    
    // Add multiple messages
    $inbox->addMessage(new FakeMessage(1, ['\\Seen'], 'From: sender1@example.com\r\nSubject: First Email\r\n\r\nFirst email content.'));
    $inbox->addMessage(new FakeMessage(2, [], 'From: sender2@example.com\r\nSubject: Second Email\r\n\r\nSecond email content.'));
    $inbox->addMessage(new FakeMessage(3, ['\\Flagged'], 'From: sender3@example.com\r\nSubject: Important Email\r\n\r\nImportant email content.'));
    
    // Get all messages
    $allMessages = $inbox->messages()->get();
    $this->assertCount(3, $allMessages);
    
    // Test finding a specific message
    $message = $inbox->messages()->find(2);
    $this->assertEquals('Second Email', $message->subject());
    
    // Test message deletion
    $inbox->messages()->destroy(2);
    $this->assertNull($inbox->messages()->find(2));
    $this->assertCount(2, $inbox->messages()->get());
}
```

## Testing with Dependency Injection

If your application uses dependency injection, you can inject the fake implementations in your tests:

```php
use DirectoryTree\ImapEngine\MailboxInterface;
use DirectoryTree\ImapEngine\Collections\MessageCollection;

class EmailService
{
    public function __construct(
        protected MailboxInterface $mailbox
    ) {}
    
    public function messages(): MessageCollection
    {
        return $this->mailbox->inbox()->messages()->get();
    }
}
```

```php
class EmailServiceTest extends TestCase
{
    public function testMessages(): void
    {
        // Create a fake mailbox
        $mailbox = new FakeMailbox(
            folders: [
                new FakeFolder(
                    path: 'inbox',
                    messages: [
                        new FakeMessage(1, ['\\Seen'], 'From: sender1@example.com\r\nSubject: Read Email\r\n\r\nRead email.'),
                        new FakeMessage(2, [], 'From: sender2@example.com\r\nSubject: Unread Email\r\n\r\nUnread email.'),
                    ]
                )
            ]
        );
        
        // Create the service with the fake mailbox
        $service = new EmailService($mailbox);
        
        // Test the method
        $unreadEmails = $service->messages();
        
        // Assert we only get the unread email
        $this->assertCount(1, $unreadEmails);
        $this->assertEquals('Unread Email', $unreadEmails->first()->subject());
    }
}
```

By using these testing utilities, you can thoroughly test your IMAP-related code without needing to connect to a real IMAP server, making your tests faster, more reliable, and independent of external services.
