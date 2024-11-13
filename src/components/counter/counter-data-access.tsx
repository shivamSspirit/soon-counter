'use client'

import {getSoocounterProgram, getSoocounterProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useSoocounterProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSoocounterProgramId(cluster.network as Cluster), [cluster])
  const program = getSoocounterProgram(provider)

  const accounts = useQuery({
    queryKey: ['soocounter', 'all', { cluster }],
    queryFn: () => program.account.counter.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const counter = Keypair.generate();

  const initialize = useMutation({
    mutationKey: ['soocounter', 'initialize', { cluster }],
    mutationFn: ({ user }: { user: PublicKey }) =>
      program.methods.initialize().accounts({
        counter: counter.publicKey,
        signer: user
      }).signers([counter]).rpc(),

    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSoocounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSoocounterProgram()

  const accountQuery = useQuery({
    queryKey: ['soocounter', 'fetch', { cluster, account }],
    queryFn: () => program.account.counter.fetch(account),
  })


  const incrementMutation = useMutation({
    mutationKey: ['soocounter', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ counter: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })


  const decrementMutation = useMutation({
    mutationKey: ['soocounter', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ counter: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })


  return {
    accountQuery,
    decrementMutation,
    incrementMutation,
  }
}
