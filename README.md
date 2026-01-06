# Hybrid Allocator Indexer

A [Ponder](https://ponder.sh) indexer for the Hybrid Allocator contract deployed across multiple EVM chains.

## Contract Address

The Hybrid Allocator is deployed at:
```
0xa110cE8BFD2Bb33fd7dB4804f9b8736fE4d05A4B
```

## Supported Networks

### Mainnets
- Ethereum Mainnet (Chain ID: 1)
- Base (Chain ID: 8453)
- Arbitrum One (Chain ID: 42161)
- Optimism (Chain ID: 10)
- Unichain (Chain ID: 130)

### Testnets
- Sepolia (Chain ID: 11155111)
- Base Sepolia (Chain ID: 84532)
- Arbitrum Sepolia (Chain ID: 421614)
- Optimism Sepolia (Chain ID: 11155420)
- Unichain Sepolia (Chain ID: 1301)

## Events Indexed

- `Allocated` - Tracks allocations made by sponsors
- `AllocatorInitialized` - Records allocator initialization per chain
- `AttestationAuthorized` - Tracks attestation authorizations
- `OwnerReplaced` - Records ownership changes
- `OwnerReplacementProposed` - Tracks proposed ownership changes
- `SignerAdded` - Records when signers are added
- `SignerRemoved` - Records when signers are removed

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Copy the environment template and add your RPC URLs:
```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` with your Alchemy (or other provider) API keys.

## Development

Run the indexer in development mode:
```bash
pnpm dev
```

## Production

Start the production server:
```bash
pnpm start
```

## API

The indexer exposes a GraphQL API at:
- `http://localhost:42069/` (root)
- `http://localhost:42069/graphql` (explicit GraphQL endpoint)

### Example Queries

**Get all allocations for a sponsor:**
```graphql
query {
  allocations(where: { sponsorAddress: "0x..." }) {
    items {
      claimHash
      chainId
      nonce
      expires
      commitments
      timestamp
    }
  }
}
```

**Get all signers:**
```graphql
query {
  signers {
    items {
      address
      isActive
      addedAt
      removedAt
    }
  }
}
```

**Get chain statistics:**
```graphql
query {
  chainStatisticss {
    items {
      chainId
      totalAllocations
      totalAttestationAuthorizations
      uniqueSponsors
    }
  }
}
```

## Schema

See `ponder.schema.ts` for the complete database schema.
