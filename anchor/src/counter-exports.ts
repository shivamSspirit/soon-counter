// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SoocounterIDL from '../target/idl/soo_counter.json'
import type { SooCounter } from '../target/types/soo_counter'

// Re-export the generated IDL and type
export { SooCounter, SoocounterIDL }

// The programId is imported from the program IDL.
export const SOONCOUNTER_PROGRAM_ID = new PublicKey(SoocounterIDL.address)

// This is a helper function to get the Soonsoonsooncounter Anchor program.
export function getSoocounterProgram(provider: AnchorProvider) {
  return new Program(SoocounterIDL as SooCounter, provider)
}

// This is a helper function to get the program ID for the Soocounter program depending on the cluster.
export function getSoocounterProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Soocounter program on devnet and testnet.
      return new PublicKey('CKFcAMMHUmcymkBGTRtgYQFCnVXQCyFaLtpdmeyjTE88')
    case 'mainnet-beta':
    default:
      return SOONCOUNTER_PROGRAM_ID
  }
}
