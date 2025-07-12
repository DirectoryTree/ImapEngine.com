---
title: Messages
nextjs:
  metadata:
    title: Interacting with Messages - ImapEngine
    description: Learn how to retrieve and interact with email messages using ImapEngine
---

ImapEngine provides a rich set of methods to interact with email messages, allowing you to efficiently manage your mailbox.

## Retrieving and Searching for Messages

For example, to retrieve messages from the last 7 days with a specific subject:

```php
$messages = $inbox->messages()
    ->since(Carbon::now()->subDays(7))
    ->subject('Hello World')
    ->get();
```

{% callout type="warning" title="Important" %}
While the `since()` method accepts a datetime instance, it does not filter
by time -- only by date. [IMAP does not support time-based filtering](https://datatracker.ietf.org/doc/html/rfc9051#section-6.4.4-15.43).
{% /callout %}

If a method doesn't exist for a specific search criteria, you may use the `where()` method to add custom criteria:

```php
$messages = $inbox->messages()
    ->where('CRITERIA', 'value')
    ->get();
```

#### Fetching Additional Message Data

By default, ImapEngine search queries only fetch message UIDs.

To fetch additional message data, you have to enable it explicitly by calling one or more of the methods below on the message query.

**Message Flags:**

Use `withFlags()` to retrieve flags, or `withoutFlags()` to omit them.

**Message Body:**

Use `withBody()` to fetch the full body content, or `withoutBody()` to skip it.

{% callout type="warning" title="Important" %}
The `withBody()` method fetches the full body content of the message, including attachments.
Keep this in mind when fetching messages, as it can be slow for large messages.
{% /callout %}

For example, to fetch messages with both their bodies, headers, and flags:

```php
$messages = $inbox->messages()
    ->withHeaders()
    ->withFlags()
    ->withBody()
    ->get();
```

**Message Headers:**

Use `withHeaders()` to include headers in the result, or `withoutHeaders()` to exclude them.

#### Message Pagination

You may paginate messages using the `paginate()` method. This method accepts the number of messages to display per page:

{% callout type="warning" title="Important" %}
IMAP does not support native pagination as you would typically expect like a SQL database. Instead,
ImapEngine retrieves all UID's from the selected folder, takes the slice of the UID's  that
corresponds to the current page, and fetches the requested email message parts specifically for those UID's.
{% /callout %}

```php
// Paginate messages with 10 messages per page.
$paginatedMessages = $inbox->messages()->paginate(10);
```

#### Message Chunking

If you need to process a large number of messages without loading them all at once, you may use the `chunk()` method:

```php
$inbox->messages()->chunk(function ($chunk, $page) {
    /** @var \DirectoryTree\ImapEngine\Message $message */
    foreach ($chunk as $message) {
        // Process each message in the current chunk.
    }
}, chunkSize: 20); // Process 20 messages per chunk.
```

You may also use the `each()` method to iterate over messages in every chunk:

```php
use DirectoryTree\ImapEngine\Message;

$inbox->messages()->each(function (Message $message) {
    // Do something with the message.
}, chunkSize: 20);
```

#### Finding a Specific Message

You may retrieve a single message by its unique identifier using the `find()` method.

The method accepts an ID and an ImapFetchIdentifier (an enum) that specifies whether the ID is a UID or a message sequence number.

For example, to find a message by UID:

```php
use DirectoryTree\ImapEngine\Enums\ImapFetchIdentifier;

$message = $inbox->messages()->find(12345, ImapFetchIdentifier::Uid);
```

Or by message sequence number:

```php
$message = $inbox->messages()->find(1, ImapFetchIdentifier::MessageNumber);
```

You may also use the `findOrFail()` method to throw an exception if the message is not found:

```php
use DirectoryTree\ImapEngine\Exceptions\MessageNotFoundException;

try {
    $message = $inbox->messages()->findOrFail(12345, ImapFetchIdentifier::Uid);
} catch (MessageNotFoundException $e) {
    // Handle message not found.
}
```

### Interacting With Messages

Once you retrieve messages from a folder using methods like `$inbox->messages()->get()`, you'll receive instances of the `DirectoryTree\ImapEngine\Message` class.

This class offers a rich set of helper methods for interacting with individual emails, making it easy to inspect, modify, and manipulate messages.

#### Retrieving Message Information

The `Message` class provides several methods to access basic properties:

**UID and Flags**

- `$message->uid(): int`: Retrieve the unique identifier (UID) of the message.
- `$message->flags(): array`: Retrieve an array of flags currently set on the message.

**Contents**

- `$message->head(): string|null`: Retrieve the raw message header.
- `$message->body(): string|null`: Retrieve the raw message body.
- `$message->hasHead(): bool` / `$message->hasBody(): bool`: Determine whether the message has headers or body.

**Headers**

To conveniently work with headers, the `Message` class includes several methods that return headers as instances of the `ZBateson\MailMimeParser\Header\IHeader` class:

- `$message->header($name): IHeader|null`: Retrieve a specific header.
- `$message->headers(): IHeader[]`: Retrieve an array of all headers.

**Metadata**

- `$message->subject(): string|null`: Retrieve the subject of the message.
- `$message->date(): Carbon|null`: Retrieve the message’s date as a Carbon instance (if available).
- `$message->messageId(): ?string|null`: Retrieves the Message-ID header (globally unique identifier for the message).

#### Additional Message Details

In addition to the methods shown above, the `Message` class provides several additional helpers:

**Flag Checking**

Quickly check whether a message has a specific flag:

- `$message->isSeen(): bool`: Determine if the message marked as `\Seen`
- `$message->isDraft(): bool`: Determine if the message marked as `\Draft`
- `$message->isRecent(): bool`: Determine if the message marked as `\Recent`
- `$message->isFlagged(): bool`: Determine if the message marked as `\Flagged`
- `$message->isDeleted(): bool`: Determine if the message marked as `\Deleted`
- `$message->isAnswered(): bool`: Determine if the message marked as `\Answered`

#### Address Handling

To conveniently work with email addresses, the `Message` class includes methods that return addresses as instances of the `DirectoryTree\ImapEngine\Address` class:

- `$message->from(): Address|null`: The sender’s address.
- `$message->sender(): Address|null`: The actual sender (if different from "from").
- `$message->replyTo(): Address|null`: The reply-to address.
- `$message->inReplyTo(): Address|null`: The In-Reply-To address.
- `$message->to(): Address[]`: An array of recipient addresses.
- `$message->cc(): Address[]`: An array of CC addresses.
- `$message->bcc(): Address[]`: An array of BCC addresses.

#### Content Retrieval

For accessing the message content in different formats:

- `$message->html(): string`: Retrieve the HTML version of the message (if available).
- `$message->text(): string`: Retrieve the plain text version of the message (if available).

#### Attachment Handling

To conveniently work with attachments, the `Message` class includes methods that return attachments as instances of the `DirectoryTree\ImapEngine\Attachment` class:

- `$message->attachments(): Attachment[]`: Retrieve an array of `Attachment` objects.
- `$message->hasAttachments(): bool`: Checks if the message contains any attachments.
- `$message->attachmentCount(): int`: Retrieve the number of attachments in the message.

For each attachment, you may access the following properties:

- `$attachment->filename(): string|null`: Retrieve the attachment's filename.
- `$attachment->contents(): string`: Retrieve the attachment's contents.
- `$attachment->contentId(): string|null`: Retrieve the attachment's content ID (cid).
- `$attachment->contentType(): string`: Retrieve the attachment's content type.
- `$attachment->contentStream(): StreamInterface`: Retrieve the attachment's contents as a stream.

{% callout type="warning" title="Important" %}
The attachment's content type is determined by the `Content-Type` header provided in the email, and may not always be accurate.
If `application/octet-stream` is returned from the `contentType` method, using [`mime_content_type()`](https://www.php.net/manual/en/function.mime-content-type.php) with the filename or contents may be used to clarify the type.
{% /callout %}

#### Flag Operations

The class also provides methods to modify message flags, which help you manage the state of a message:

**Marking as Seen/Unseen**

- `$message->markSeen(): void`: Marks the message as read.
- `$message->unmarkSeen(): void`: Marks the message as unread.
- *Aliases:* `$message->markRead(): void` and `$message->markUnread(): void`.

**Other Flags**

- `$message->markDraft(): void` / `$message->unmarkDraft(): void`
- `$message->markRecent(): void` / `$message->unmarkRecent(): void`
- `$message->markFlagged(): void` / `$message->unmarkFlagged(): void`
- `$message->markDeleted(): void` / `$message->unmarkDeleted(): void`
- `$message->markAnswered(): void` / `$message->unmarkAnswered(): void`

All these methods work by invoking the underlying IMAP `STORE` command (with the appropriate flag and operation).

#### Message Manipulation

Beyond just flagging, you may move or copy messages between folders, as well as delete them:

- `$message->restore(): void`: Unmarks the message as deleted.
- `$message->copy(string $folder): void`: Copies the message to the specified folder.
- `$message->move(string $folder, bool $expunge = false): void`: Moves the message to the specified folder.
- `$message->delete(bool $expunge = false): void`: Marks the message as deleted and expunges it immediately from the folder (if `$expunge` is `true`).

#### Example: Interacting with a Retrieved Message

```php
// Retrieve the first message from the inbox.
$message = $inbox->messages()->first();

// Get the message UID.
$message->uid();

// Get the message subject.
$message->subject();

// Get the message sender.
$message->from(); // Address

// Get the message from name and email.
$message->from()->name();
$message->from()->email();

// Get the message date.
$message->date(); // Carbon\Carbon

// Get the message's attachments.
foreach ($message->attachments() as $attachment) {
    // Get the attachment's filename.
    $attachment->filename();

    // Get the attachment's content type.
    $attachment->contentType();

    // Get the attachment's contents.
    $attachment->contents();

    // Get the attachment's extension.
    $extension = $attachment->extension();

    // Save the attachment to a local file.
    $attachment->save("/path/to/save/attachment.$extension");
}

// Mark the message as read.
$message->markSeen();

// Move the message to an "Archive" folder.
$message->move('Archive');

// Delete the message.
$message->delete();
```

### Creating Draft Messages

ImapEngine allows you to create draft messages and save them to the server for later editing or sending.

To create a new draft message, you may use the `append()` method on a folder instance:

```php
use DirectoryTree\ImapEngine\DraftMessage;

$uid = $inbox->messages()->append(
    new DraftMessage(
        from: = 'foo@email.com',
        to: = 'bar@email.com',
        subject: = 'Hello World'
        text: = 'This is the message body.',
        html: = '<p>This is the message body.</p>',
    )
);
```

Draft messages also accept attachments:

```php
$inbox->messages()->append(
    new DraftMessage(
        // ...
        attachments: [
            '/path/to/attachment.pdf',
            '/path/to/another-attachment.jpg',
        ]
    )
);
```
