# Smirk Website TODO

See [smirk-backend/docs/SOCIAL_TIPPING.md](../smirk-backend/docs/SOCIAL_TIPPING.md) for full architecture.

## Completed

### Extension API (DONE - 2026-01-22)
- [x] Inject `window.smirk` API - Content script injects API object into pages
- [x] `window.smirk.connect()` - Returns public keys for all 5 assets
- [x] `window.smirk.signMessage(message)` - Signs message with user's chosen asset
- [x] `window.smirk.isConnected()` - Check if site is connected
- [x] `window.smirk.disconnect()` - Revoke site access
- [x] `window.smirk.getPublicKeys()` - Get public keys if already connected
- [x] Approval popup UI - Show user what site is requesting, allow approve/deny
- [x] Origin allowlist - Track which origins user has approved

### Backend Auth Endpoints (DONE - 2026-01-24)
- [x] `POST /api/v1/auth/website/challenge` - Generate challenge with nonce + origin
- [x] `POST /api/v1/auth/website/verify` - Verify signature, issue JWT session token
- [x] `GET /api/v1/auth/me` - Get current user info from JWT
- [x] Single-asset authentication - User picks favorite coin to sign with

### Website Foundation (DONE - 2026-01-25)
- [x] Next.js 16 project with App Router
- [x] Tailwind CSS setup
- [x] Landing page with connect button
- [x] Extension detection (`window.smirk` check)
- [x] Authentication flow (connect → choose coin → sign → logged in)
- [x] JWT storage in localStorage
- [x] Logout functionality

### Linked Accounts (DONE - 2026-01-26)
- [x] Settings page at `/settings`
- [x] List currently linked platforms
- [x] "Link Telegram" button → verification flow
- [x] Verification UI: enter username → get code → send to bot → confirm
- [x] Unlink platform button

---

## Phase 2: Core Dashboard

### Dashboard Home
- [ ] Display user UUID
- [ ] Display balances for all 5 assets (fetched via backend)
- [ ] Auto-refresh balances (polling or WebSocket)
- [ ] Loading skeletons and error states

### Tip History (Basic)
- [ ] List of tips sent (existing tip_links)
- [ ] List of tips received
- [ ] Pagination
- [ ] Filter by asset type
- [ ] Click to view tip details

## Phase 3: Social Tipping Dashboard

### Tips Sent (`/tips/sent`)
- [ ] List social tips with status (pending/claimed/clawed-back)
- [ ] Filter by platform (Telegram/Discord/direct)
- [ ] Clawback button (enabled anytime for unclaimed tips)
- [ ] Confirmation modal for clawback
- [ ] "Resend notification" option

### Tips Received (`/tips/received`)
- [ ] List tips received (claimed and pending)
- [ ] Claim pending tips (verify platform ownership first)
- [ ] Link to transaction on blockchain explorer

### Public Tips (`/tips/public`) - Phase 2
- [ ] View public tips sent by user
- [ ] Claim status tracking
- [ ] Share link/payload copy button

## Phase 5: Additional Platforms

- [ ] Discord linking flow
- [ ] Signal linking flow (future)
- [ ] Simplex linking flow (future)
- [ ] Matrix linking flow (future)

## Phase 6: Social Features (Future)

### Direct Tipping
- [ ] Send tip to another Smirk user by UUID
- [ ] Send tip via username/handle (from website)
- [ ] Tip confirmation flow

### Messaging (Future)
- [ ] Direct messages between users
- [ ] Encrypted messaging (E2E)

### Discovery (Future)
- [ ] Public profiles (opt-in)
- [ ] Search users
- [ ] Tipping leaderboards (opt-in)

## Technical Debt / Polish

- [ ] Comprehensive error handling
- [ ] Loading skeletons
- [ ] Mobile responsive design
- [ ] Dark/light theme (sync with extension setting?)
- [ ] Accessibility (a11y)
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Rate limiting on frontend
- [ ] E2E tests with Playwright

## Deployment

- [ ] Docker configuration
- [ ] Nginx reverse proxy setup (alongside backend)
- [ ] Environment configuration
- [ ] CI/CD pipeline
- [ ] Monitoring and alerting

---

## Notes

### Signing Algorithm Reference

For message signing (implemented in extension, verified by backend):
- **BTC/LTC**: ECDSA (secp256k1) with Bitcoin message signing format
- **XMR/WOW**: Ed25519 using private spend key
- **Grin**: Ed25519 using slatepack key

### Challenge Message Format

```
Smirk Authentication Challenge
Nonce: abc123...
Origin: https://smirk.to
Timestamp: 1706000000
```

Challenge expires after 5 minutes.
