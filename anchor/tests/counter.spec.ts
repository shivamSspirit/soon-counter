import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { SooCounter } from '../target/types/soo_counter'

describe('soo-counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.SooCounter as Program<SooCounter>;

  const counterKeypair = new Keypair();

  it('Initialize Counter', async () => {
    await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        signer: payer.publicKey,
      })
      .signers([counterKeypair])
      .rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey);

    console.log("currentCount", currentCount.count)

    expect(currentCount.count.toNumber()).toEqual(0)
  })

  it('Increment Counter', async () => {
    await program.methods.increment().accounts({ counter: counterKeypair.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count.toNumber()).toEqual(1)
  })

  it('Decrement Counter', async () => {
    await program.methods.decrement().accounts({ counter: counterKeypair.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count.toNumber()).toEqual(0)
  })


})
