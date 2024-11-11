#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod soonsoonsooncounter {
    use super::*;

  pub fn close(_ctx: Context<CloseSoonsoonsooncounter>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.soonsoonsooncounter.count = ctx.accounts.soonsoonsooncounter.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.soonsoonsooncounter.count = ctx.accounts.soonsoonsooncounter.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSoonsoonsooncounter>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.soonsoonsooncounter.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSoonsoonsooncounter<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Soonsoonsooncounter::INIT_SPACE,
  payer = payer
  )]
  pub soonsoonsooncounter: Account<'info, Soonsoonsooncounter>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSoonsoonsooncounter<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub soonsoonsooncounter: Account<'info, Soonsoonsooncounter>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub soonsoonsooncounter: Account<'info, Soonsoonsooncounter>,
}

#[account]
#[derive(InitSpace)]
pub struct Soonsoonsooncounter {
  count: u8,
}
