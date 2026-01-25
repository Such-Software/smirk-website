# Smirk Website

User dashboard for Smirk wallet users. Requires the Smirk browser extension to access.

## Overview

This website serves as a hub for Smirk wallet users to:
- View their account UUID and balances
- See tipping history (sent and received)
- Manage connected accounts (Telegram, Discord, etc.)
- Future: Chat/messaging between users, direct tipping, etc.

**Important**: This site is ONLY accessible to users with the Smirk extension installed. Authentication happens via cryptographic signatures from the user's wallet keys.

## Architecture

### Deployment Options

The website is designed to be deployable either:
1. **Alongside the backend** - Served from the same server as smirk-backend (current plan)
2. **Separately** - As a standalone deployment (e.g., Vercel, separate server)

Keep this flexibility in mind when developing - avoid tight coupling to backend internals.

### Extension Communication

The Smirk extension injects a `window.smirk` API object into web pages. The website uses this to:

1. **Detect extension** - Check if `window.smirk` exists
2. **Connect** - Request user's public keys (with user approval)
3. **Sign** - Request signatures for authentication challenges (BTC/LTC: ECDSA, XMR/WOW/Grin: Ed25519)

```
┌─────────────┐     window.smirk      ┌─────────────────┐
│   Website   │ ◄──────────────────► │ Smirk Extension │
└──────┬──────┘                       └────────┬────────┘
       │                                       │
       │ POST /auth/verify                     │ User approves
       │ { publicKeys, signatures }            │ in popup
       ▼                                       ▼
┌─────────────┐                       ┌─────────────────┐
│   Backend   │                       │  Extension UI   │
└─────────────┘                       └─────────────────┘
```

### Authentication Flow

1. User clicks "Connect with Smirk"
2. Website calls `window.smirk.connect()`
3. Extension shows approval popup
4. User approves → Extension returns public keys for all 5 assets
5. Website calls `POST /api/v1/auth/website/challenge` with origin
6. Backend returns challenge message (with nonce + timestamp + origin)
7. Website calls `window.smirk.signMessage(challenge)`
8. Extension shows signing popup with the message
9. User approves → Extension returns signatures from all 5 keys
10. Website sends `{ challenge_id, signatures }` to `POST /api/v1/auth/website/verify`
11. Backend verifies signatures, looks up user by BTC pubkey_hash, issues JWT session
12. Website stores JWT, user is now authenticated

**Future**: Allow single-asset auth (user picks their favorite coin to sign with).

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State**: React Context / Zustand (TBD)
- **Auth**: JWT sessions verified against backend

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# For production
NEXT_PUBLIC_API_URL=https://api.smirk.cash
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing / Connect page
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── page.tsx       # Main dashboard (balances, UUID)
│   │   ├── history/       # Tip history
│   │   └── settings/      # Account settings
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ConnectButton.tsx  # "Connect with Smirk" button
│   ├── Dashboard/         # Dashboard components
│   └── ui/                # Shared UI components
├── lib/
│   ├── smirk.ts          # window.smirk API wrapper
│   ├── auth.ts           # Authentication utilities
│   └── api.ts            # Backend API client
└── types/
    └── smirk.d.ts        # TypeScript types for window.smirk
```

## Security Considerations

- Challenge messages include timestamps to prevent replay attacks
- Signatures are verified server-side against registered public keys
- JWT tokens have reasonable expiration
- HTTPS required in production
- CSP headers to prevent XSS

## Related Projects

- [smirk-extension](../smirk-extension) - Browser extension (injects `window.smirk`)
- [smirk-backend](../smirk-backend) - Rust backend API
