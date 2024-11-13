use anchor_lang::prelude::*;

declare_id!("Ho4gWX427c2qWdy1ZrQ97qA5B8eeSe86okrxJ1nMxvkR");

#[program]
pub mod soo_counter {
    use super::*;

    pub fn initialize(ctx: Context<InitializeCounter>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter;
        counter_account.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        ctx.accounts.counter.count = ctx.accounts.counter.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        ctx.accounts.counter.count = ctx.accounts.counter.count.checked_sub(1).unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + Counter::INIT_SPACE,
      )]
    pub counter: Account<'info, Counter>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u64,
}
