'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useSoocounterProgram } from './counter-data-access'
import { SoocounterCreate, SoocounterList } from './counter-ui'

export default function SoocounterFeature() {
  const { publicKey } = useWallet()
  const { programId } = useSoocounterProgram()

  return publicKey ? (
    <div>
      <AppHero
        title="Soocounter"
        subtitle={
          'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement).'
        }
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <SoocounterCreate />
      </AppHero>
      <SoocounterList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
