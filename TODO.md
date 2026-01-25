# Smirk Website TODO

## Phase 1: Foundation (Critical Path)

### Extension API (DONE - 2026-01-22)
- [x] **Inject `window.smirk` API** - Content script injects API object into pages
- [x] **`window.smirk.connect()`** - Returns public keys for all 5 assets
- [x] **`window.smirk.signMessage(message)`** - Signs message with all 5 asset keys
- [x] **`window.smirk.isConnected()`** - Check if site is connected
- [x] **`window.smirk.disconnect()`** - Revoke site access
- [x] **`window.smirk.getPublicKeys()`** - Get public keys if already connected
- [x] **Approval popup UI** - Show user what site is requesting, allow approve/deny
- [x] **Origin allowlist** - Track which origins user has approved (persisted to storage)

### Backend Auth Endpoints (DONE - 2026-01-24)
- [x] `POST /api/v1/auth/website/challenge` - Generate challenge with nonce + origin
- [x] `POST /api/v1/auth/website/verify` - Verify signatures, issue JWT session token
- [x] `GET /api/v1/auth/me` - Get current user info from JWT
- [ ] JWT middleware for protected routes (frontend side)

### Website Basics
- [ ] Initialize Next.js project with App Router
- [ ] Tailwind CSS setup
- [ ] Basic layout (header, footer)
- [ ] Landing page with "Connect with Smirk" button
- [ ] Extension detection (`window.smirk` check)
- [ ] "Install Smirk" fallback if extension not detected

## Phase 2: Core Dashboard

### Authentication Flow
- [ ] Connect button triggers `window.smirk.connect()`
- [ ] Challenge generation and signing
- [ ] Backend verification and JWT storage
- [ ] Protected route middleware
- [ ] Logout functionality

### Dashboard - Basic
- [ ] Display user UUID
- [ ] Display balances for all 5 assets
- [ ] Auto-refresh balances
- [ ] Loading states and error handling

### Dashboard - Tip History
- [ ] List of tips sent
- [ ] List of tips received
- [ ] Pagination
- [ ] Filter by asset type
- [ ] Click to view tip details

## Phase 3: Account Management

### Connected Accounts
- [ ] Link Telegram account
- [ ] Link Discord account
- [ ] Link other platforms (Twitter/X, etc.)
- [ ] Manage/unlink accounts
- [ ] Display linked accounts on dashboard

### Settings
- [ ] Notification preferences
- [ ] Privacy settings
- [ ] Export account data

## Phase 4: Social Features (Future)

### Direct Tipping
- [ ] Send tip to another Smirk user by UUID
- [ ] Send tip via username/handle
- [ ] Tip confirmation flow
- [ ] Tip notifications

### Messaging (Future)
- [ ] Direct messages between users
- [ ] Encrypted messaging (E2E?)
- [ ] Message notifications

### Discovery (Future)
- [ ] Public profiles (opt-in)
- [ ] Search users
- [ ] Leaderboards?

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

### Extension Work Required (add to smirk-extension/TODO.md)

The website cannot function without these extension features:

1. **Content script injection** - Must inject `window.smirk` on all pages (or configurable origins)
2. **Message passing** - Content script ↔ Background script communication
3. **Approval UI** - Popup for connect/sign requests
4. **Security** - Origin tracking, user approval persistence

### Signing Algorithm Notes

For message signing (all implemented in extension):
- **BTC/LTC**: ECDSA signature (secp256k1) with Bitcoin message signing format
- **XMR/WOW**: Ed25519 signature using private spend key
- **Grin**: Ed25519 signature using slatepack key

Backend must implement verification for all signature types.

### Challenge Message Format

```
Sign this message to authenticate with smirk.cash

Timestamp: 2026-01-22T12:00:00Z
Nonce: abc123...
Origin: https://smirk.cash
```

Challenge should expire after ~5 minutes to prevent replay attacks.

### Single-Asset Authentication (DONE - 2026-01-25)

User picks their favorite coin to sign with:
- Simpler UX - choose one coin, sign once
- User data - "What's your favorite coin?" insight
- Any of the 5 coins proves wallet ownership

This positions Smirk as infrastructure for wallet-based authentication across multiple cryptocurrencies.
