# Avalanche SDKs

This is an official Ava Labs monorepo for JavaScript/TypeScript SDKs and tools.

## Getting Started 🚀

```sh
pnpm i        # installs all dependencies
pnpm build    # builds all packages
```

## What's inside?

### Packages

- `vm-parser`: A library for parsing on-chain data to a format that can be easily displayed by out Subnet Explorer.
- `tsconfig`: tsconfig for sdks (private)
- `eslint`: eslint config for sdks (private)

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Useful commands

- `yarn build` - Build all packages
- `yarn dev` - Develop all packages
- `yarn lint` - Lint all packages
- `yarn changeset` - Generate a changeset
- `yarn clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Versioning and Publishing packages

Package publishing has been configured using [Changesets](https://github.com/changesets/changesets). Please review their [documentation](https://github.com/changesets/changesets#documentation) to familiarize yourself with the workflow.

This repo has an automated npm releases setup in a [GitHub Action](https://github.com/changesets/action) using the [Changesets bot](https://github.com/apps/changeset-bot).
