import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Soonsoonsooncounter} from '../target/types/soonsoonsooncounter'

describe('soonsoonsooncounter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Soonsoonsooncounter as Program<Soonsoonsooncounter>

  const soonsoonsooncounterKeypair = Keypair.generate()

  it('Initialize Soonsoonsooncounter', async () => {
    await program.methods
      .initialize()
      .accounts({
        soonsoonsooncounter: soonsoonsooncounterKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([soonsoonsooncounterKeypair])
      .rpc()

    const currentCount = await program.account.soonsoonsooncounter.fetch(soonsoonsooncounterKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Soonsoonsooncounter', async () => {
    await program.methods.increment().accounts({ soonsoonsooncounter: soonsoonsooncounterKeypair.publicKey }).rpc()

    const currentCount = await program.account.soonsoonsooncounter.fetch(soonsoonsooncounterKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Soonsoonsooncounter Again', async () => {
    await program.methods.increment().accounts({ soonsoonsooncounter: soonsoonsooncounterKeypair.publicKey }).rpc()

    const currentCount = await program.account.soonsoonsooncounter.fetch(soonsoonsooncounterKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Soonsoonsooncounter', async () => {
    await program.methods.decrement().accounts({ soonsoonsooncounter: soonsoonsooncounterKeypair.publicKey }).rpc()

    const currentCount = await program.account.soonsoonsooncounter.fetch(soonsoonsooncounterKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set soonsoonsooncounter value', async () => {
    await program.methods.set(42).accounts({ soonsoonsooncounter: soonsoonsooncounterKeypair.publicKey }).rpc()

    const currentCount = await program.account.soonsoonsooncounter.fetch(soonsoonsooncounterKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the soonsoonsooncounter account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        soonsoonsooncounter: soonsoonsooncounterKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.soonsoonsooncounter.fetchNullable(soonsoonsooncounterKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
