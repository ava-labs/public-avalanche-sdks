# Contributing

Thanks for your interest in contributing to public-avalanche-sdks! Please take a moment to review this document **before submitting a pull request.**

If you want to contribute, but aren't sure where to start, you can create a [new discussion](https://github.com/ava-labs/public-avalanche-sdks/discussions).

## Our projects

> **Note**
>
> **Please ask first before starting work on any significant new features.**
>
> It's never a fun experience to have your pull request declined after investing time and effort into a new feature. To avoid this from happening, we request that contributors create a [feature request](https://github.com/ava-labs/public-avalanche-sdks/discussions) to first discuss any significant new ideas.

<br>

- `teleporter-demo`: A demo of the Avalanche Teleporter cross-chain messaging system for EVM subnets.
- `vm-parser` (🚧 **WIP** 🚧): Parse arbitrary VM data for display in the Avalanche Subnet Explorer.

## Basic guide

This guide is intended to help you get started with contributing. By following these steps, you will understand the development process and workflow.

- [Contributing](#contributing)
  - [Our projects](#our-projects)
  - [Basic guide](#basic-guide)
    - [Forking the repository](#forking-the-repository)
    - [Cloning your fork](#cloning-your-fork)
    - [Installing dependencies](#installing-dependencies)
    - [Submitting a pull request](#submitting-a-pull-request)
    - [Versioning](#versioning)

---

### Forking the repository

To start contributing to the project, fork it to your own github account.

### Cloning your fork

```bash
git clone https://github.com/<YOUR_FORK>/public-avalanche-sdks.git --recurse-submodules
```

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

---

If the versions are not correct or you don't have Node.js or pnpm installed, download and follow their setup instructions:

- Install Node.js using [fnm](https://github.com/Schniz/fnm) or from the [official website](https://nodejs.org)
- Install [pnpm](https://pnpm.io/installation)

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

---

### Installing dependencies

Once in the project's root directory, run the following command to install the project's dependencies:

```bash
pnpm install
```

After the install completes, pnpm links packages across the project for development and [git hooks](https://github.com/toplenboren/simple-git-hooks) are set up.

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

---

### Submitting a pull request

When you're ready to submit a pull request, you can follow these naming conventions:

- Pull request titles use the [Imperative Mood](https://en.wikipedia.org/wiki/Imperative_mood) (e.g., `Add something`, `Fix something`).
- [Changesets](#versioning) use past tense verbs (e.g., `Added something`, `Fixed something`).

When you submit a pull request, GitHub will automatically lint, build, and test your changes. If you see an ❌, it's most likely a bug in your code. Please, inspect the logs through the GitHub UI to find the cause.

Your pull request should be from your fork -> the `main` branch of this repo.

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

---

### Versioning

When adding new features or fixing bugs, we'll need to bump the package versions. We use [Changesets](https://github.com/changesets/changesets) to do this.

> **Note**
>
> Only changes to the codebase that affect the public API or existing behavior (e.g. bugs) need changesets.

Each changeset defines which package(s) should be published and whether the change should be a major/minor/patch release, as well as providing release notes that will be added to the changelog upon release.

To create a new changeset, run `pnpm changeset`. This will run the Changesets CLI, prompting you for details about the change. You’ll be able to edit the file after it’s created — don’t worry about getting everything perfect up front.

Even though you can technically use any markdown formatting you like, headings should be avoided since each changeset will ultimately be nested within a bullet list. Instead, bold text should be used as section headings.

If your PR is making changes to an area that already has a changeset (e.g. there’s an existing changeset covering theme API changes but you’re making further changes to the same API), you should update the existing changeset in your PR rather than creating a new one.

---

<br>

<div>
  ✅ Now you're ready to contribute to public-avalanche-sdks!
</div>

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

---
