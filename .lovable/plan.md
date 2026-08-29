# Fix: Mobile Navigation Menu Doesn't Scroll

## The bug

On a phone, opening the hamburger menu shows the full link list (Thesis, Case Study, Architecture, Roles, Congress, Founder, Quantum switcher, plus signed-in items: Console, Room, Manual, Tour, Digest, Inbox, Invite, Sign out). The Header sets `document.body.style.overflow = "hidden"` while the menu is open, and the menu panel itself has no height limit or scroll behavior — so on short viewports the list is clipped and cannot be scrolled.

## The fix (one file)

**`src/components/briefing/Header.tsx`**

1. Make the open menu panel scrollable:
   - On the `#mobile-nav` container, add `max-h-[calc(100dvh-3.5rem)] overflow-y-auto` so it fills the space below the sticky 3.5rem header and scrolls internally.
   - Keep the body scroll lock as-is (prevents the background page from scrolling behind the menu).

2. Minor polish while here:
   - Add `pb-[env(safe-area-inset-bottom)]` padding inside the menu so the last item (Sign out) clears phone home-indicator bars.

## Verification

- Preview at mobile viewport, signed in: open menu, confirm all items reachable by scrolling, background doesn't move, menu closes on link tap and restores page scroll.
