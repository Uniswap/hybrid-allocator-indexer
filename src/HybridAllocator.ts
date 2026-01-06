import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import type { Address, Hex } from "viem";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Ensures an account exists in the database
 */
async function ensureAccount(db: any, address: Address, timestamp: bigint) {
  await db
    .insert(schema.account)
    .values({
      address,
      firstSeenAt: timestamp,
    })
    .onConflictDoNothing();
}

/**
 * Ensures a signer exists in the database
 */
async function ensureSigner(db: any, address: Address, timestamp: bigint) {
  await db
    .insert(schema.signer)
    .values({
      address,
      isActive: true,
      addedAt: timestamp,
      removedAt: null,
    })
    .onConflictDoNothing();
}

/**
 * Updates chain statistics
 */
async function updateChainStatistics(
  db: any,
  chainId: bigint,
  timestamp: bigint,
  updates: {
    totalAllocations?: bigint;
    totalAttestationAuthorizations?: bigint;
    uniqueSponsors?: bigint;
  }
) {
  const existing = await db
    .find(schema.chainStatistics, { chainId })
    .catch(() => null);

  if (!existing) {
    await db.insert(schema.chainStatistics).values({
      chainId,
      totalAllocations: updates.totalAllocations || 0n,
      totalAttestationAuthorizations: updates.totalAttestationAuthorizations || 0n,
      uniqueSponsors: updates.uniqueSponsors || 0n,
      lastUpdated: timestamp,
    });
  } else {
    await db
      .update(schema.chainStatistics, { chainId })
      .set({
        totalAllocations:
          updates.totalAllocations !== undefined
            ? existing.totalAllocations + updates.totalAllocations
            : existing.totalAllocations,
        totalAttestationAuthorizations:
          updates.totalAttestationAuthorizations !== undefined
            ? existing.totalAttestationAuthorizations + updates.totalAttestationAuthorizations
            : existing.totalAttestationAuthorizations,
        uniqueSponsors: updates.uniqueSponsors || existing.uniqueSponsors,
        lastUpdated: timestamp,
      });
  }
}

// ============================================================================
// ALLOCATED EVENT HANDLER
// ============================================================================

ponder.on("HybridAllocator:Allocated", async ({ event, context }) => {
  const { db } = context;
  const { sponsor, commitments, nonce, expires, claimHash } = event.args;

  const chainId = BigInt(context.network.chainId);
  const timestamp = event.block.timestamp;

  // Ensure sponsor account exists
  await ensureAccount(db, sponsor, timestamp);

  // Convert commitments to JSON
  const commitmentsJson = JSON.stringify(
    commitments.map((c: any) => ({
      lockTag: c.lockTag,
      token: c.token,
      amount: c.amount.toString(),
    }))
  );

  // Insert allocation record
  const allocationId = `${claimHash}-${chainId}`;
  await db.insert(schema.allocation).values({
    id: allocationId,
    claimHash,
    chainId,
    sponsorAddress: sponsor,
    nonce,
    expires,
    commitments: commitmentsJson,
    blockNumber: event.block.number,
    timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
  });

  // Update chain statistics
  await updateChainStatistics(db, chainId, timestamp, { totalAllocations: 1n });
});

// ============================================================================
// ALLOCATOR INITIALIZED EVENT HANDLER
// ============================================================================

ponder.on("HybridAllocator:AllocatorInitialized", async ({ event, context }) => {
  const { db } = context;
  const { compact, owner, allocatorId } = event.args;

  const chainId = BigInt(context.network.chainId);
  const timestamp = event.block.timestamp;

  // Ensure owner account exists
  await ensureAccount(db, owner, timestamp);

  // Insert or update allocator instance
  await db
    .insert(schema.allocatorInstance)
    .values({
      chainId,
      compactAddress: compact,
      ownerAddress: owner,
      allocatorId: BigInt(allocatorId),
      initializedAt: timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    })
    .onConflictDoUpdate({
      compactAddress: compact,
      ownerAddress: owner,
      allocatorId: BigInt(allocatorId),
      initializedAt: timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
    });
});

// ============================================================================
// ATTESTATION AUTHORIZED EVENT HANDLER
// ============================================================================

ponder.on("HybridAllocator:AttestationAuthorized", async ({ event, context }) => {
  const { db } = context;
  const { nonce } = event.args;

  const chainId = BigInt(context.network.chainId);
  const timestamp = event.block.timestamp;

  // Insert attestation authorization record
  const authId = `${nonce}-${chainId}`;
  await db.insert(schema.attestationAuthorization).values({
    id: authId,
    nonce,
    chainId,
    blockNumber: event.block.number,
    timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
  });

  // Update chain statistics
  await updateChainStatistics(db, chainId, timestamp, { totalAttestationAuthorizations: 1n });
});

// ============================================================================
// OWNER REPLACED EVENT HANDLER
// ============================================================================

ponder.on("HybridAllocator:OwnerReplaced", async ({ event, context }) => {
  const { db } = context;
  const { oldOwner, newOwner } = event.args;

  const chainId = BigInt(context.network.chainId);
  const timestamp = event.block.timestamp;

  // Ensure both accounts exist
  await ensureAccount(db, oldOwner, timestamp);
  await ensureAccount(db, newOwner, timestamp);

  // Insert owner change record
  const changeId = `${event.transaction.hash}-${event.log.logIndex}`;
  await db.insert(schema.ownerChange).values({
    id: changeId,
    chainId,
    oldOwner,
    newOwner,
    blockNumber: event.block.number,
    timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
  });

  // Update allocator instance with new owner
  await db
    .update(schema.allocatorInstance, { chainId })
    .set({
      ownerAddress: newOwner,
    })
    .catch(() => {
      // Allocator instance might not exist yet
    });
});

// ============================================================================
// OWNER REPLACEMENT PROPOSED EVENT HANDLER
// ============================================================================

ponder.on("HybridAllocator:OwnerReplacementProposed", async ({ event, context }) => {
  const { db } = context;
  const { newOwner } = event.args;

  const chainId = BigInt(context.network.chainId);
  const timestamp = event.block.timestamp;

  // Ensure new owner account exists
  await ensureAccount(db, newOwner, timestamp);

  // Insert owner replacement proposal record
  const proposalId = `${event.transaction.hash}-${event.log.logIndex}`;
  await db.insert(schema.ownerReplacementProposal).values({
    id: proposalId,
    chainId,
    proposedOwner: newOwner,
    blockNumber: event.block.number,
    timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
  });
});

// ============================================================================
// SIGNER ADDED EVENT HANDLER
// ============================================================================

ponder.on("HybridAllocator:SignerAdded", async ({ event, context }) => {
  const { db } = context;
  const { signer: signerAddress } = event.args;

  const chainId = BigInt(context.network.chainId);
  const timestamp = event.block.timestamp;

  // Ensure signer exists
  await ensureSigner(db, signerAddress, timestamp);

  // Update signer to active
  await db
    .update(schema.signer, { address: signerAddress })
    .set({
      isActive: true,
      removedAt: null,
    });

  // Insert signer change record
  const changeId = `${event.transaction.hash}-${event.log.logIndex}`;
  await db.insert(schema.signerChange).values({
    id: changeId,
    chainId,
    signerAddress,
    changeType: "added",
    blockNumber: event.block.number,
    timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
  });
});

// ============================================================================
// SIGNER REMOVED EVENT HANDLER
// ============================================================================

ponder.on("HybridAllocator:SignerRemoved", async ({ event, context }) => {
  const { db } = context;
  const { signer: signerAddress } = event.args;

  const chainId = BigInt(context.network.chainId);
  const timestamp = event.block.timestamp;

  // Update signer to inactive
  await db
    .update(schema.signer, { address: signerAddress })
    .set({
      isActive: false,
      removedAt: timestamp,
    })
    .catch(() => {
      // Signer might not exist
    });

  // Insert signer change record
  const changeId = `${event.transaction.hash}-${event.log.logIndex}`;
  await db.insert(schema.signerChange).values({
    id: changeId,
    chainId,
    signerAddress,
    changeType: "removed",
    blockNumber: event.block.number,
    timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
  });
});
