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

#### Filtering by Message Size

You can filter messages by their size in bytes using the `larger()` and `smaller()` methods:

```php
// Get messages larger than 5MB
$messages = $inbox->messages()->larger(5 * 1024 * 1024)->get();

// Get messages smaller than 100KB
$messages = $inbox->messages()->smaller(100 * 1024)->get();

// Get messages between 1MB and 10MB
$messages = $inbox->messages()
    ->larger(1 * 1024 * 1024)
    ->smaller(10 * 1024 * 1024)
    ->get();
```

This is useful for finding large emails that may contain attachments, or for filtering out small notification emails.

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

**Message Body Structure:**

Use `withBodyStructure()` to fetch the MIME structure of messages, or `withoutBodyStructure()` to skip it.

```php
$messages = $inbox->messages()
    ->withBodyStructure()
    ->get();
```

{% callout type="note" title="Performance Tip" %}
Fetching body structure is much more efficient than fetching the full message body when you only need to inspect the message's MIME structure, parts, or attachments metadata without downloading the actual content.
{% /callout %}

#### Server-Side Sorting

ImapEngine supports server-side sorting using the [RFC 5256 SORT extension](https://datatracker.ietf.org/doc/html/rfc5256). This allows you to sort messages directly on the IMAP server, which is more efficient than fetching all messages and sorting them locally.

```php
use DirectoryTree\ImapEngine\Enums\ImapSortKey;

// Sort messages by date (ascending)
$messages = $inbox->messages()->sortBy('date')->get();

// Sort messages by date (descending)
$messages = $inbox->messages()->sortBy('date', 'desc')->get();

// Or use the sortByDesc helper
$messages = $inbox->messages()->sortByDesc('date')->get();
```

You can also use the `ImapSortKey` enum for type-safe sort keys:

```php
use DirectoryTree\ImapEngine\Enums\ImapSortKey;

$messages = $inbox->messages()->sortBy(ImapSortKey::Subject)->get();
```

**Available Sort Keys:**

| Key | Description |
|-----|-------------|
| `date` | Sort by the Date header |
| `arrival` | Sort by the arrival time (when the message was received) |
| `from` | Sort by the From header |
| `to` | Sort by the To header |
| `cc` | Sort by the CC header |
| `subject` | Sort by the Subject header |
| `size` | Sort by the message size |

**Combining with Search Criteria:**

Server-side sorting works seamlessly with search criteria:

```php
// Get unread messages sorted by arrival time (newest first)
$messages = $inbox->messages()
    ->unseen()
    ->sortByDesc('arrival')
    ->get();

// Get messages from a sender sorted by subject
$messages = $inbox->messages()
    ->from('newsletter@example.com')
    ->sortBy('subject')
    ->get();
```

{% callout type="warning" title="Server Support Required" %}
Server-side sorting requires the IMAP server to support the SORT capability (RFC 5256). If the server does not support this capability, an `ImapCapabilityException` will be thrown.
{% /callout %}

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

#### Body Structure

ImapEngine provides powerful methods to inspect the MIME structure of messages without downloading the full message body. This is particularly useful for:

- Inspecting message parts and their content types
- Identifying attachments and their metadata (filename, size, encoding)
- Determining if a message has HTML or plain text parts
- Fetching specific message parts by their part number

**Fetching Body Structure**

To access the body structure, you must first fetch it using `withBodyStructure()`:

```php
$messages = $inbox->messages()
    ->withBodyStructure()
    ->get();

foreach ($messages as $message) {
    if ($message->hasBodyStructure()) {
        $structure = $message->bodyStructure();
    }
}
```

**Understanding Body Structure**

The body structure is represented as either:
- A `BodyStructureCollection` for multipart messages (e.g., messages with both HTML and plain text, or messages with attachments)
- A single `BodyStructurePart` wrapped in a collection for simple messages

**Working with Multipart Messages**

For multipart messages, you can access various properties:

```php
$structure = $message->bodyStructure();

// Get the multipart subtype (e.g., "mixed", "alternative", "related")
$structure->subtype(); // "alternative"

// Get the content type
$structure->contentType(); // "multipart/alternative"

// Get the boundary parameter
$structure->boundary(); // "Aq14h3UL"

// Get all parameters
$structure->parameters(); // ['boundary' => 'Aq14h3UL']

// Get direct child parts
$structure->parts(); // Array of BodyStructurePart or BodyStructureCollection

// Count the number of parts
$structure->count(); // 2
```

**Accessing Message Parts**

You can access specific parts of the message structure:

```php
// Get all parts flattened (including nested parts)
$allParts = $structure->flatten();

// Find a specific part by part number
$part = $structure->find('1.2');

// Get the text/plain part
$textPart = $structure->text();

// Get the text/html part
$htmlPart = $structure->html();
```

**Working with Individual Parts**

Each `BodyStructurePart` provides detailed information about a message part:

```php
$part = $structure->text();

// Get the part number (e.g., "1", "1.2", "2.1.3")
$part->partNumber(); // "1"

// Get the MIME type and subtype
$part->type(); // "text"
$part->subtype(); // "plain"
$part->contentType(); // "text/plain"

// Get parameters (e.g., charset)
$part->parameters(); // ['charset' => 'utf-8']
$part->parameter('charset'); // "utf-8"
$part->charset(); // "utf-8"

// Get encoding and size
$part->encoding(); // "quoted-printable"
$part->size(); // 1024 (bytes)
$part->lines(); // 50 (for text parts)

// Get content ID and description
$part->id(); // "<part1@example.com>"
$part->description(); // "Message body"

// Check part type
$part->isText(); // true
$part->isHtml(); // false
$part->isAttachment(); // false
$part->isInline(); // false
```

**Inspecting Attachments**

Body structure makes it easy to identify and inspect attachments without downloading them:

```php
// Get all attachment parts
$attachments = $structure->attachments();

// Check if message has attachments
if ($structure->hasAttachments()) {
    // Get attachment count
    $count = $structure->attachmentCount();

    foreach ($attachments as $attachment) {
        // Get attachment metadata
        $attachment->filename(); // "document.pdf"
        $attachment->contentType(); // "application/pdf"
        $attachment->size(); // 50000 (bytes)
        $attachment->encoding(); // "base64"

        // Get disposition information
        $disposition = $attachment->disposition();
        $disposition->type(); // ContentDispositionType::Attachment
        $disposition->isAttachment(); // true
        $disposition->isInline(); // false
        $disposition->parameters(); // ['filename' => 'document.pdf']
    }
}
```

**Fetching Specific Body Parts**

Once you know the part number from the body structure, you can fetch that specific part's content:

```php
// Fetch a specific body part by part number (without marking the message as seen)
$partContent = $message->bodyPart('1.2');

// Fetch a specific body part by part number (marking the message as seen)
$partContent = $message->bodyPart('1.2', peek: false);
```

This is useful for:
- Downloading only the HTML or text version of a message
- Selectively loading message content based on the structure
- Fetching individual attachments without downloading the entire message

**Example: Processing Messages with Body Structure**

```php
$messages = $inbox->messages()
    ->withBodyStructure()
    ->get();

foreach ($messages as $message) {
    $structure = $message->bodyStructure();

    // Check if message has attachments
    if ($structure->hasAttachments()) {
        echo "Message has {$structure->attachmentCount()} attachment(s)\n";

        foreach ($structure->attachments() as $attachment) {
            echo "- {$attachment->filename()} ({$attachment->size()} bytes)\n";

            // Fetch only this attachment's content
            $content = $message->bodyPart($attachment->partNumber());
        }
    }

    // Get the HTML version if available
    if ($htmlPart = $structure->html()) {
        $htmlContent = $message->bodyPart($htmlPart->partNumber());
    }

    // Get the plain text version if available
    if ($textPart = $structure->text()) {
        $textContent = $message->bodyPart($textPart->partNumber());
    }
}
```

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

### Bulk Operations

ImapEngine allows you to perform bulk operations on messages matching a query, without needing to fetch and iterate over each message individually. This is much more efficient than processing messages one by one.

All bulk operations return the number of messages affected.

#### Bulk Flag Operations

You can mark multiple messages as read or unread in a single operation:

```php
// Mark all unseen messages as read
$count = $inbox->messages()->unseen()->markRead();

// Mark all messages from a sender as unread
$count = $inbox->messages()->from('newsletter@example.com')->markUnread();
```

You can also flag or unflag multiple messages:

```php
// Flag all messages from your boss
$count = $inbox->messages()->from('boss@company.com')->markFlagged();

// Unflag old flagged messages
$count = $inbox->messages()->flagged()->before('2024-01-01')->unmarkFlagged();
```

For custom flags, use the `flag()` method directly:

```php
use DirectoryTree\ImapEngine\Enums\ImapFlag;

// Add a flag to matching messages
$count = $inbox->messages()->subject('Important')->flag(ImapFlag::Flagged, '+');

// Remove a flag from matching messages
$count = $inbox->messages()->seen()->flag(ImapFlag::Seen, '-');
```

#### Bulk Move and Copy

Move or copy multiple messages to another folder:

```php
// Move old messages to archive
$count = $inbox->messages()->before('2023-01-01')->move('Archive');

// Copy important messages to a backup folder
$count = $inbox->messages()->flagged()->copy('Backup');
```

You can also expunge the folder after moving messages:

```php
// Move and immediately expunge
$count = $inbox->messages()->from('spam@example.com')->move('Spam', expunge: true);
```

#### Bulk Delete

Delete multiple messages matching a query:

```php
// Delete all messages from a sender
$count = $inbox->messages()->from('spam@example.com')->delete();

// Delete and immediately expunge
$count = $inbox->messages()->before('2022-01-01')->delete(expunge: true);
```

{% callout type="warning" title="Important" %}
Bulk operations execute directly on the IMAP server without fetching message content. This makes them very efficient, but also means they cannot be easily undone. Use with caution, especially with `delete()` and `expunge: true`.
{% /callout %}

#### Example: Cleaning Up a Mailbox

```php
// Mark all newsletters as read
$inbox->messages()
    ->from('newsletter@example.com')
    ->markRead();

// Archive messages older than 6 months
$inbox->messages()
    ->before(Carbon::now()->subMonths(6))
    ->move('Archive');

// Delete spam and expunge immediately
$inbox->messages()
    ->from('spam@example.com')
    ->delete(expunge: true);
```

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
