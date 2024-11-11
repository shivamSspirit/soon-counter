// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SoonsoonsooncounterIDL from '../target/idl/soonsoonsooncounter.json'
import type { Soonsoonsooncounter } from '../target/types/soonsoonsooncounter'

// Re-export the generated IDL and type
export { Soonsoonsooncounter, SoonsoonsooncounterIDL }

// The programId is imported from the program IDL.
export const SOONCOUNTER_PROGRAM_ID = new PublicKey(SoonsoonsooncounterIDL.address)

// This is a helper function to get the Soonsoonsooncounter Anchor program.
export function getSoonsoonsooncounterProgram(provider: AnchorProvider) {
  return new Program(SoonsoonsooncounterIDL as Soonsoonsooncounter, provider)
}

// This is a helper function to get the program ID for the Soonsoonsooncounter program depending on the cluster.
export function getSoonsoonsooncounterProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Soonsoonsooncounter program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return SOONCOUNTER_PROGRAM_ID
  }
}
