export const HybridAllocatorAbi = [
  // ============================================================================
  // EVENTS
  // ============================================================================
  {
    type: "event",
    name: "Allocated",
    inputs: [
      {
        name: "sponsor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "commitments",
        type: "tuple[]",
        indexed: false,
        internalType: "struct Lock[]",
        components: [
          { name: "lockTag", type: "bytes12", internalType: "bytes12" },
          { name: "token", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "nonce",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "expires",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "claimHash",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AllocatorInitialized",
    inputs: [
      {
        name: "compact",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "allocatorId",
        type: "uint96",
        indexed: false,
        internalType: "uint96",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AttestationAuthorized",
    inputs: [
      {
        name: "nonce",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnerReplaced",
    inputs: [
      {
        name: "oldOwner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnerReplacementProposed",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SignerAdded",
    inputs: [
      {
        name: "signer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SignerRemoved",
    inputs: [
      {
        name: "signer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  // ============================================================================
  // FUNCTIONS (for reference / transaction parsing)
  // ============================================================================
  {
    type: "constructor",
    inputs: [
      { name: "owner_", type: "address", internalType: "address" },
      { name: "signer_", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ALLOCATOR_ID",
    inputs: [],
    outputs: [{ name: "", type: "uint96", internalType: "uint96" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "acceptOwnerReplacement",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addSigner",
    inputs: [{ name: "signer_", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allocateAndRegister",
    inputs: [
      { name: "recipient", type: "address", internalType: "address" },
      { name: "idsAndAmounts", type: "uint256[2][]", internalType: "uint256[2][]" },
      { name: "arbiter", type: "address", internalType: "address" },
      { name: "expires", type: "uint256", internalType: "uint256" },
      { name: "typehash", type: "bytes32", internalType: "bytes32" },
      { name: "witness", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      { name: "", type: "bytes32", internalType: "bytes32" },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "attest",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "sponsor", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "authorizeAttestation",
    inputs: [
      { name: "sponsor", type: "address", internalType: "address" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "expires", type: "uint256", internalType: "uint256" },
      {
        name: "commitments",
        type: "tuple[]",
        internalType: "struct Lock[]",
        components: [
          { name: "lockTag", type: "bytes12", internalType: "bytes12" },
          { name: "token", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "allocatorSignature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "authorized", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "authorizeClaim",
    inputs: [
      { name: "claimHash", type: "bytes32", internalType: "bytes32" },
      { name: "", type: "address", internalType: "address" },
      { name: "sponsor", type: "address", internalType: "address" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256[2][]", internalType: "uint256[2][]" },
      { name: "allocatorData_", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executeAllocation",
    inputs: [
      { name: "recipient", type: "address", internalType: "address" },
      { name: "idsAndAmounts", type: "uint256[2][]", internalType: "uint256[2][]" },
      { name: "additionalCommitmentAmounts", type: "uint256[]", internalType: "uint256[]" },
      { name: "arbiter", type: "address", internalType: "address" },
      { name: "expires", type: "uint256", internalType: "uint256" },
      { name: "typehash", type: "bytes32", internalType: "bytes32" },
      { name: "witness", type: "bytes32", internalType: "bytes32" },
      { name: "context", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isClaimAuthorized",
    inputs: [
      { name: "claimHash", type: "bytes32", internalType: "bytes32" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256[2][]", internalType: "uint256[2][]" },
      { name: "allocatorData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nonces",
    inputs: [],
    outputs: [{ name: "", type: "uint88", internalType: "uint88" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "permit2Allocation",
    inputs: [
      { name: "arbiter", type: "address", internalType: "address" },
      { name: "depositor", type: "address", internalType: "address" },
      { name: "expires", type: "uint256", internalType: "uint256" },
      {
        name: "permitted",
        type: "tuple[]",
        internalType: "struct ISignatureTransfer.TokenPermissions[]",
        components: [
          { name: "token", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "additionalCommitmentAmounts", type: "uint256[]", internalType: "uint256[]" },
      {
        name: "details",
        type: "tuple",
        internalType: "struct DepositDetails",
        components: [
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint256", internalType: "uint256" },
          { name: "lockTag", type: "bytes12", internalType: "bytes12" },
        ],
      },
      { name: "claimHash", type: "bytes32", internalType: "bytes32" },
      { name: "witness", type: "string", internalType: "string" },
      { name: "witnessHash", type: "bytes32", internalType: "bytes32" },
      { name: "signature", type: "bytes", internalType: "bytes" },
      { name: "context", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct Lock[]",
        components: [
          { name: "lockTag", type: "bytes12", internalType: "bytes12" },
          { name: "token", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "prepareAllocation",
    inputs: [
      { name: "recipient", type: "address", internalType: "address" },
      { name: "idsAndAmounts", type: "uint256[2][]", internalType: "uint256[2][]" },
      { name: "additionalCommitmentAmounts", type: "uint256[]", internalType: "uint256[]" },
      { name: "arbiter", type: "address", internalType: "address" },
      { name: "expires", type: "uint256", internalType: "uint256" },
      { name: "typehash", type: "bytes32", internalType: "bytes32" },
      { name: "witness", type: "bytes32", internalType: "bytes32" },
      { name: "context", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "nonce", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "proposeOwnerReplacement",
    inputs: [{ name: "newOwner_", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeSigner",
    inputs: [{ name: "signer_", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "replaceSigner",
    inputs: [
      { name: "oldSigner_", type: "address", internalType: "address" },
      { name: "newSigner_", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "signers",
    inputs: [{ name: "signer", type: "address", internalType: "address" }],
    outputs: [{ name: "isSigner", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  // ============================================================================
  // ERRORS
  // ============================================================================
  { type: "error", name: "AttestationExpired", inputs: [] },
  { type: "error", name: "CallerNotOwner", inputs: [] },
  {
    type: "error",
    name: "InsufficientAttestationAmount",
    inputs: [
      { name: "availableAmount", type: "uint256", internalType: "uint256" },
      { name: "requestedAmount", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidAllocatorId",
    inputs: [
      { name: "allocatorId", type: "uint96", internalType: "uint96" },
      { name: "expectedAllocatorId", type: "uint96", internalType: "uint96" },
    ],
  },
  {
    type: "error",
    name: "InvalidAllocatorRegistration",
    inputs: [
      { name: "alreadyRegisteredAllocator", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "InvalidCaller",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "expectedSender", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "InvalidClaim",
    inputs: [{ name: "claimHash", type: "bytes32", internalType: "bytes32" }],
  },
  { type: "error", name: "InvalidIds", inputs: [] },
  { type: "error", name: "InvalidOwner", inputs: [] },
  { type: "error", name: "InvalidPreparation", inputs: [] },
  {
    type: "error",
    name: "InvalidRegistration",
    inputs: [
      { name: "sponsor", type: "address", internalType: "address" },
      { name: "claimHash", type: "bytes32", internalType: "bytes32" },
    ],
  },
  {
    type: "error",
    name: "InvalidRegistration",
    inputs: [
      { name: "recipient", type: "address", internalType: "address" },
      { name: "claimHash", type: "bytes32", internalType: "bytes32" },
      { name: "typehash", type: "bytes32", internalType: "bytes32" },
    ],
  },
  { type: "error", name: "InvalidSignature", inputs: [] },
  { type: "error", name: "InvalidSigner", inputs: [] },
  {
    type: "error",
    name: "InvalidValue",
    inputs: [
      { name: "value", type: "uint256", internalType: "uint256" },
      { name: "expectedValue", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "Unsupported", inputs: [] },
] as const;
