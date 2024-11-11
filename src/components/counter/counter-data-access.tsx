'use client'

import {getSoonsoonsooncounterProgram, getSoonsoonsooncounterProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useSoonsoonsooncounterProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSoonsoonsooncounterProgramId(cluster.network as Cluster), [cluster])
  const program = getSoonsoonsooncounterProgram(provider)

  const accounts = useQuery({
    queryKey: ['soonsoonsooncounter', 'all', { cluster }],
    queryFn: () => program.account.soonsoonsooncounter.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['soonsoonsooncounter', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ soonsoonsooncounter: keypair.publicKey }).signers([keypair]).rpc(),
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

export function useSoonsoonsooncounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSoonsoonsooncounterProgram()

  const accountQuery = useQuery({
    queryKey: ['soonsoonsooncounter', 'fetch', { cluster, account }],
    queryFn: () => program.account.soonsoonsooncounter.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['soonsoonsooncounter', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ soonsoonsooncounter: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['soonsoonsooncounter', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ soonsoonsooncounter: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['soonsoonsooncounter', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ soonsoonsooncounter: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['soonsoonsooncounter', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ soonsoonsooncounter: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
