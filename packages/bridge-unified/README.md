<p align="center">
  <a href="https://subnets.avax.network/">
      <picture>
        <img alt="Avalanche Logo" src="https://images.ctfassets.net/gcj8jwzm6086/Gse8dqDEnJtT87RsbbEf4/1609daeb09e9db4a6617d44623028356/Avalanche_Horizontal_White.svg" width="auto" height="60">
      </picture>
  </a>
</p>

<p align="center">
  A package for routing tokens from Chain A to Chain B, and unifying multiple bridge tools into one.
<p>

## What is this?

The bridging ecosystem is complex. There are often multiple tools that can be used to bridge tokens from one chain to another, and sometimes to get a token from chain A to C you need to use multiple bridging tools and route through chain B first. This package simplifies that process by creating the _Unified Bridge API_, a standard interface for bridging tokens from one chain to another without having to worry about the underlying tools or the underlying intermediary chains.

These are the bridges we currently support:

- **Avalanche Bridge** - is capable of transferring a fixed list of tokens between Ethereum and Avalanche C-Chain. See the `@avalabs/bridge-avalanche` package.
- **CCTP** - preferred for brdiging USDC between Ethereum and Avalanche C-Chain. See the `@avalabs/bridge-cctp` package.

Future bridges we plan to support:

- **Teleporter** - for moving tokens between subnets.
- **Cross-Chain Transfer** - for moving tokens between the three Avalanche Primary Network chains (X-Chain, C-Chain, and P-Chain).

## Getting Started

```sh
  npm install @avalabs/bridge-unified
  # or
  yarn add @avalabs/bridge-unified
  # or
  pnpm add @avalabs/bridge-unified
```

## How it works

TODO: Explain details of this api.
