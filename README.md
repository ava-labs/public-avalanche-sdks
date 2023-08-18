<br/>

<p align="center">
  <a href="https://subnets.avax.network/">
      <picture>
        <img alt="Avalanche Logo" src="https://images.ctfassets.net/gcj8jwzm6086/Gse8dqDEnJtT87RsbbEf4/1609daeb09e9db4a6617d44623028356/Avalanche_Horizontal_White.svg" width="auto" height="60">
      </picture>
</a>
</p>

<h1 align="center">Consumer SDKs</h1>
<p align="center">
  This is an official Ava Labs monorepo for JavaScript/TypeScript SDKs and tools.
</p>

## Getting Started 🚀

```sh
pnpm i        # installs all dependencies
pnpm build    # builds all packages
```

## What's inside? 🔍

### Packages

#### External

> These Packages are published to NPM

- `unified-bridge`: Use the avalanche bridge, teleporter, CCTP, and Cross Chain Transfer (X/P/C) with a single API.

#### Internal

> These packages are only used internally within this repo

- `tsconfig-custom`: tsconfig for sdks (private)
- `eslint-config-custom`: eslint config for sdks (private)
- `github-actions-custom`: eslint config for sdks (private)

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Useful commands

- `pnpm build` - Build all packages
- `pnpm dev` - Develop all packages
- `pnpm lint` - Lint all packages
- `pnpm changeset` - Generate a changeset.  See in #versioning-and-publishing-packages

## Versioning and Publishing packages

Package publishing has been configured using [Changesets](https://github.com/changesets/changesets). Please review their [documentation](https://github.com/changesets/changesets#documentation) to familiarize yourself with the workflow.

This repo has an automated npm releases setup in a [GitHub Action](https://github.com/changesets/action) using the [Changesets bot](https://github.com/apps/changeset-bot).
