<p align="center">
    <img src="https://github.com/DirectoryTree/ImapEngine/blob/master/art/logo.svg" width="300" alt="ImapEngine Documentation">
</p>

<p align="center">The documentation website for ImapEngine.</p>

<p align="center">
    <a href="https://github.com/DirectoryTree/ImapEngine.com/blob/master/LICENSE"><img src="https://img.shields.io/github/license/DirectoryTree/ImapEngine.com?style=flat-square" alt="License"></a>
</p>

<p align="center">
    <a href="https://imapengine.com">Documentation</a>
    <span> · </span>
    <a href="#installation">Installation</a>
    <span> · </span>
    <a href="#development">Development</a>
    <span> · </span>
    <a href="#building">Building</a>
</p>

---

## Requirements

- Node.js 20 or higher
- npm

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/DirectoryTree/ImapEngine.com.git
cd ImapEngine.com
npm ci
```

## Development

Start the development server:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) in your browser. Documentation pages are written in Markdown under `src/app`, with Markdoc components and configuration under `src/markdoc`.

## Building

Build the static website:

```bash
npm run build
```

The generated website is written to `out`.
