import { onchainTable, index, primaryKey, relations } from "ponder";

// ============================================================================
// INDEXED BLOCKS (24-hour retention for cross-indexer consistency checks)
// ============================================================================

export const indexedBlock = onchainTable(
  "indexed_block",
  (t) => ({
    chainId: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    blockHash: t.hex().notNull(),
    blockTimestamp: t.bigint().notNull(),
    indexedAt: t.bigint().notNull(), // When this block was indexed (for cleanup)
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.blockNumber, table.chainId] }),
    chainIdIdx: index().on(table.chainId),
    blockHashIdx: index().on(table.blockHash),
    timestampIdx: index().on(table.blockTimestamp),
  })
);

// ============================================================================
// ALLOCATOR
// ============================================================================

export const account = onchainTable("account", (t) => ({
  address: t.hex().primaryKey(),
  firstSeenAt: t.bigint().notNull(),
}));

// ============================================================================
// SIGNERS
// ============================================================================

export const signer = onchainTable("signer", (t) => ({
  address: t.hex().primaryKey(),
  isActive: t.boolean().notNull().default(true),
  addedAt: t.bigint().notNull(),
  removedAt: t.bigint(),
}));

// ============================================================================
// ALLOCATOR INSTANCES (per chain)
// ============================================================================

export const allocatorInstance = onchainTable(
  "allocator_instance",
  (t) => ({
    // Composite ID: chainId
    chainId: t.bigint().primaryKey(),

    // From AllocatorInitialized event
    compactAddress: t.hex().notNull(),
    ownerAddress: t.hex().notNull(),
    allocatorId: t.bigint().notNull(), // uint96 stored as bigint

    // Metadata
    initializedAt: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
  }),
  (table) => ({
    ownerIdx: index().on(table.ownerAddress),
  })
);

// ============================================================================
// ALLOCATIONS
// ============================================================================

export const allocation = onchainTable(
  "allocation",
  (t) => ({
    // Composite ID: claimHash-chainId
    id: t.text().primaryKey(),

    claimHash: t.hex().notNull(),
    chainId: t.bigint().notNull(),

    // From Allocated event
    sponsorAddress: t.hex().notNull(),
    nonce: t.bigint().notNull(),
    expires: t.bigint().notNull(),

    // Commitments stored as JSON
    // Each commitment: { lockTag: bytes12, token: address, amount: uint256 }
    commitments: t.text().notNull(), // JSON array

    // Metadata
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
    logIndex: t.integer().notNull(),
  }),
  (table) => ({
    claimHashIdx: index().on(table.claimHash),
    sponsorIdx: index().on(table.sponsorAddress),
    chainIdIdx: index().on(table.chainId),
    timestampIdx: index().on(table.timestamp),
    nonceIdx: index().on(table.nonce),
  })
);

// ============================================================================
// ATTESTATION AUTHORIZATIONS
// ============================================================================

export const attestationAuthorization = onchainTable(
  "attestation_authorization",
  (t) => ({
    // Composite ID: nonce-chainId
    id: t.text().primaryKey(),

    nonce: t.bigint().notNull(),
    chainId: t.bigint().notNull(),

    // Metadata
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
    logIndex: t.integer().notNull(),
  }),
  (table) => ({
    nonceIdx: index().on(table.nonce),
    chainIdIdx: index().on(table.chainId),
    timestampIdx: index().on(table.timestamp),
  })
);

// ============================================================================
// OWNER CHANGES
// ============================================================================

export const ownerChange = onchainTable(
  "owner_change",
  (t) => ({
    // Composite ID: transactionHash-logIndex
    id: t.text().primaryKey(),

    chainId: t.bigint().notNull(),
    oldOwner: t.hex().notNull(),
    newOwner: t.hex().notNull(),

    // Metadata
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
    logIndex: t.integer().notNull(),
  }),
  (table) => ({
    chainIdIdx: index().on(table.chainId),
    oldOwnerIdx: index().on(table.oldOwner),
    newOwnerIdx: index().on(table.newOwner),
    timestampIdx: index().on(table.timestamp),
  })
);

// ============================================================================
// OWNER REPLACEMENT PROPOSALS
// ============================================================================

export const ownerReplacementProposal = onchainTable(
  "owner_replacement_proposal",
  (t) => ({
    // Composite ID: transactionHash-logIndex
    id: t.text().primaryKey(),

    chainId: t.bigint().notNull(),
    proposedOwner: t.hex().notNull(),

    // Metadata
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
    logIndex: t.integer().notNull(),
  }),
  (table) => ({
    chainIdIdx: index().on(table.chainId),
    proposedOwnerIdx: index().on(table.proposedOwner),
    timestampIdx: index().on(table.timestamp),
  })
);

// ============================================================================
// SIGNER CHANGES (Added/Removed)
// ============================================================================

export const signerChange = onchainTable(
  "signer_change",
  (t) => ({
    // Composite ID: transactionHash-logIndex
    id: t.text().primaryKey(),

    chainId: t.bigint().notNull(),
    signerAddress: t.hex().notNull(),
    changeType: t.text().notNull(), // "added" or "removed"

    // Metadata
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
    logIndex: t.integer().notNull(),
  }),
  (table) => ({
    chainIdIdx: index().on(table.chainId),
    signerIdx: index().on(table.signerAddress),
    changeTypeIdx: index().on(table.changeType),
    timestampIdx: index().on(table.timestamp),
  })
);

// ============================================================================
// CHAIN STATISTICS (Aggregated data)
// ============================================================================

export const chainStatistics = onchainTable("chain_statistics", (t) => ({
  chainId: t.bigint().primaryKey(),

  totalAllocations: t.bigint().notNull().default(0n),
  totalAttestationAuthorizations: t.bigint().notNull().default(0n),
  uniqueSponsors: t.bigint().notNull().default(0n),

  lastUpdated: t.bigint().notNull(),
}));

// ============================================================================
// RELATIONS
// ============================================================================

export const accountRelations = relations(account, ({ many }) => ({
  allocations: many(allocation),
}));

export const allocationRelations = relations(allocation, ({ one }) => ({
  sponsor: one(account, {
    fields: [allocation.sponsorAddress],
    references: [account.address],
  }),
}));

export const signerChangeRelations = relations(signerChange, ({ one }) => ({
  signer: one(signer, {
    fields: [signerChange.signerAddress],
    references: [signer.address],
  }),
}));
