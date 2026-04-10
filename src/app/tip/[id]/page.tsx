import type { Metadata } from 'next';
import { getPublicTipInfo } from '@/lib/api';
import TipPageClient, { formatAmount } from './TipPageClient';

const COIN_NAMES: Record<string, string> = {
  btc: 'Bitcoin',
  ltc: 'Litecoin',
  xmr: 'Monero',
  wow: 'Wownero',
  grin: 'Grin',
};

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const tip = await getPublicTipInfo(id);
    const coinName = COIN_NAMES[tip.asset.toLowerCase()] || tip.asset.toUpperCase();
    const amount = formatAmount(tip.amount, tip.asset);
    const statusText = tip.status === 'pending' ? 'Claim it now!' : `Status: ${tip.status}`;

    return {
      title: `${amount} ${coinName} Tip`,
      description: `Someone sent you ${amount} via Smirk Wallet. ${statusText}`,
      openGraph: {
        title: `${amount} ${coinName} Tip`,
        description: `Someone sent you ${amount} via Smirk Wallet. ${statusText}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${amount} ${coinName} Tip`,
        description: `Someone sent you ${amount} via Smirk Wallet. ${statusText}`,
      },
    };
  } catch {
    return {
      title: 'Crypto Tip',
      description: 'Claim your crypto tip with Smirk Wallet.',
    };
  }
}

export default async function TipPage({ params }: Props) {
  const { id } = await params;
  return <TipPageClient tipId={id} />;
}
