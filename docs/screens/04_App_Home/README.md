# 04_App_Home

> **Status:** empty · **Class:** C2

The shell every signed-in person lands in. Built as a shell; its extension points are deliberately undefined (C14).

## Screens in this branch

Home_Page · Guide_Channel · Search · New · Feed · Player · Tasks · Account · Role_Switcher · Role_Store

Each becomes a folder copied from [`../SCREEN-TEMPLATE/`](../SCREEN-TEMPLATE/) when it is
written. Until then this branch holds the place and the honest fact that it is unwritten.

**Feed and Player were added 2026-09-12** from the afternoon addendum
([`../../strategy/ENGAGEMENT-LAYER.md`](../../strategy/ENGAGEMENT-LAYER.md) §3). Both are
empty and both carry an unresolved conflict rather than a specification: a recommending
Feed is inference across a memory partition unless ADR-016 is satisfied first (A45, C38),
and a Player has no permitted records and no completion event, which under ADR-021 means
it cannot yet be specified (A46). Recording them here is not permission to build them.

Rules: [`../00-SCREEN-BOOK.md`](../00-SCREEN-BOOK.md).
