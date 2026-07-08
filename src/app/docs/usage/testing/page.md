---
title: Testing
nextjs:
  metadata:
    title: Testing with ImapEngine - ImapEngine
    description: Learn how to test your application with ImapEngine using test fakes without connecting to a real IMAP server.
---

ImapEngine provides fake implementations that let you test mailbox code without connecting to a real IMAP server. They are useful for unit tests, CI pipelines, and application services that depend on ImapEngine interfaces.

## Using Test Fakes

ImapEngine includes fake implementations for its core interfaces:

- `FakeMailbox`: A fake implementation of `MailboxInterface`
- `FakeFolder`: A fake implementation of `FolderInterface`
- `FakeMessage`: A fake implementation of `MessageInterface`
- `FakeMessageQuery`: A fake implementation of `MessageQueryInterface`
- `FakeFolderRepository`: A fake implementation of `FolderRepositoryInterface`

These classes allow you to create a complete in-memory mailbox for tests.

## Creating a Fake Mailbox

```php
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMailbox;
use DirectoryTree\ImapEngine\Testing\FakeMessage;

$mailbox = new FakeMailbox(
    config: [
        'host' => 'imap.example.com',
        'port' => 993,
        'username' => 'test@example.com',
    ],
    folders: [
        new FakeFolder(
            path: 'INBOX',
            messages: [
                new FakeMessage(
                    uid: 1,
                    flags: ['\\Seen'],
                    contents: "From: sender@example.com\r\nSubject: Test Email\r\n\r\nThis is a test email."
                ),
            ],
        ),
        new FakeFolder('Sent'),
        new FakeFolder('Trash'),
    ],
    capabilities: ['IMAP4rev1', 'IDLE', 'UIDPLUS'],
);
```

## Adding Fake Messages

You can add messages during folder initialization or later with `addMessage()`:

```php
$inbox = new FakeFolder('INBOX');

$inbox->addMessage(
    new FakeMessage(
        uid: 2,
        flags: [],
        contents: "From: sender@example.com\r\nSubject: Unread Email\r\n\r\nThis is an unread email.",
    )
);
```

`FakeMessage` also accepts an explicit message size and body structure when your code needs to exercise those paths:

```php
$message = new FakeMessage(
    uid: 3,
    flags: ['\\Flagged'],
    contents: "From: sender@example.com\r\nSubject: Report\r\n\r\nAttached.",
    size: 1024,
    bodyStructure: $bodyStructure,
);
```

## Testing with PHPUnit

```php
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMailbox;
use DirectoryTree\ImapEngine\Testing\FakeMessage;
use PHPUnit\Framework\TestCase;

class EmailProcessorTest extends TestCase
{
    public function testProcessNewEmails(): void
    {
        $mailbox = new FakeMailbox(
            folders: [
                new FakeFolder(
                    path: 'INBOX',
                    messages: [
                        new FakeMessage(
                            uid: 1,
                            flags: ['\\Seen'],
                            contents: "From: sender@example.com\r\nSubject: Test Email\r\n\r\nThis is a test email.",
                        ),
                    ],
                ),
            ],
        );

        $messages = $mailbox->inbox()->messages()->get();

        $this->assertCount(1, $messages);
        $this->assertSame('Test Email', $messages->first()->subject());
    }
}
```

## Testing with Pest

```php
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMailbox;
use DirectoryTree\ImapEngine\Testing\FakeMessage;

it('processes new emails', function () {
    $mailbox = new FakeMailbox(
        folders: [
            new FakeFolder(
                path: 'INBOX',
                messages: [
                    new FakeMessage(
                        uid: 1,
                        flags: ['\\Seen'],
                        contents: "From: sender@example.com\r\nSubject: Test Email\r\n\r\nThis is a test email.",
                    ),
                ],
            ),
        ],
    );

    $messages = $mailbox->inbox()->messages()->get();

    expect($messages)->toHaveCount(1);
    expect($messages->first()->subject())->toBe('Test Email');
});
```

## Testing Message Operations

Fake messages support the same flag helpers as real messages:

```php
$inbox = new FakeFolder('INBOX', messages: [
    new FakeMessage(
        uid: 1,
        flags: [],
        contents: "From: sender@example.com\r\nSubject: Unread Email\r\n\r\nThis is an unread email.",
    ),
]);

$mailbox = new FakeMailbox(folders: [$inbox]);

$message = $mailbox->inbox()->messages()->find(1);

expect($message->isSeen())->toBeFalse();

$message->markSeen();

expect($message->isSeen())->toBeTrue();
```

## Testing Folder Operations

Fake folders can be created, mutated, and inspected entirely in memory:

```php
$mailbox = new FakeMailbox(folders: [new FakeFolder('INBOX')]);

$archive = $mailbox->folders()->create('Archive');

$archive
    ->setFlags(['\\HasNoChildren'])
    ->setDelimiter('/')
    ->addMessage(new FakeMessage(
        uid: 1,
        contents: "From: sender@example.com\r\nSubject: Archived Email\r\n\r\nThis is an archived email.",
    ));

expect($mailbox->folders()->find('Archive'))->not->toBeNull();
expect($archive->messages()->get())->toHaveCount(1);
expect($archive->quota())->toHaveKey('Archive');
```

## Testing Message Queries

Fake message queries support retrieval, append, destroy, pagination, chunking, and bulk-operation count behavior:

```php
$inbox = new FakeFolder('INBOX', messages: [
    new FakeMessage(1, ['\\Seen'], "From: sender1@example.com\r\nSubject: First Email\r\n\r\nFirst email content."),
    new FakeMessage(2, [], "From: sender2@example.com\r\nSubject: Second Email\r\n\r\nSecond email content."),
]);

$mailbox = new FakeMailbox(folders: [$inbox]);

$query = $mailbox->inbox()->messages();

expect($query->count())->toBe(2);
expect($query->find(2)->subject())->toBe('Second Email');
expect($query->append("Subject: Third Email\r\n\r\nThird email content."))->toBe(3);
expect($query->paginate(perPage: 2))->toHaveCount(2);

$query->destroy(2);

expect($query->find(2))->toBeNull();
```

{% callout type="note" title="Search Criteria" %}
`FakeMessageQuery` records search criteria so your code can call the same query methods it uses in production, but it does not filter the in-memory messages by those criteria. Use it to test your integration with the query API, not IMAP server search behavior.
{% /callout %}

## Testing with Dependency Injection

If your application depends on ImapEngine contracts, inject fake implementations in your tests:

```php
use DirectoryTree\ImapEngine\Collections\MessageCollection;
use DirectoryTree\ImapEngine\MailboxInterface;
use DirectoryTree\ImapEngine\Testing\FakeFolder;
use DirectoryTree\ImapEngine\Testing\FakeMailbox;
use DirectoryTree\ImapEngine\Testing\FakeMessage;

class EmailService
{
    public function __construct(
        protected MailboxInterface $mailbox,
    ) {}

    public function messages(): MessageCollection
    {
        return $this->mailbox->inbox()->messages()->get();
    }
}

it('retrieves messages from the service', function () {
    $mailbox = new FakeMailbox(
        folders: [
            new FakeFolder(
                path: 'INBOX',
                messages: [
                    new FakeMessage(1, ['\\Seen'], "From: sender1@example.com\r\nSubject: Read Email\r\n\r\nRead email."),
                    new FakeMessage(2, [], "From: sender2@example.com\r\nSubject: Unread Email\r\n\r\nUnread email."),
                ],
            ),
        ],
    );

    $service = new EmailService($mailbox);

    expect($service->messages())->toHaveCount(2);
});
```

By using these testing utilities, you can thoroughly test your IMAP-related code without needing to connect to a real IMAP server.
