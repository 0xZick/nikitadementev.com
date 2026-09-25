export const person = {
  name: 'Nikita Dementev',
  handle: '0xZick',
  kicker: 'engineering lead / protocol engineer',
  location: 'Dubai · UTC+4',
  email: 'puffingcheeks@gmail.com',
  telegram: 'https://t.me/zick0x',
  telegramHandle: '@zick0x',
  github: 'https://github.com/0xZick',
  x: 'https://x.com/0xZick',
  site: 'https://nikitadementev.com',
  ledeHtml:
    'Engineering lead and protocol engineer. Ten years in software, eight on Ethereum. I start products from an empty repo and take them to users — founder of <strong>nft.multisender.app</strong> (~$300k/year profit), co-founder of NFTxCards and zRexFinance. Engineer at Tornado Cash (~$1B&nbsp;peak&nbsp;TVL). Known online as <strong>0xZick</strong>.',
  description:
    'Nikita Dementev (0xZick): engineering lead and Solidity / TypeScript engineer in Dubai. Engineer at Tornado Cash (~$1B peak TVL), founder of nft.multisender.app, co-founder of NFTxCards and zRexFinance.',
  get lede() {
    return this.ledeHtml.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
  },
};

export const now = {
  status: 'Independent since Sep 2026, after two years at Liquorice. Building my own products.',
  openTo: 'protocol / full-stack contract work, technical advisory, co-founding — DeFi, wallets, infra',
  where: 'Dubai, UTC+4 · remote worldwide · English B2, Russian native',
  reply: 'Telegram, same day',
};

export const languages = [
  { name: 'Russian', level: 'native' },
  { name: 'English', level: 'B2, working daily' },
];

export const education = {
  school: 'Vladivostok State University of Economics and Service',
  degree: 'Applied Informatics',
  years: '2013–2017',
  city: 'Vladivostok',
};

export const stack = [
  {
    area: 'Contracts',
    items:
      'Solidity, Yul / assembly, Foundry (unit / fuzz / invariant / fork), Hardhat, OpenZeppelin UUPS, ERC-20 / 721 / 1155 / 4626, EIP-712, create2, Chainlink (Data Feeds, Functions, VRF), Aave / Compound / Uniswap / 1inch integrations, Slither, Echidna',
  },
  {
    area: 'Frontend',
    items:
      'TypeScript, React, Next.js (App Router / RSC), Feature-Sliced Design, wagmi / viem, RainbowKit, SIWE, Storybook, Vitest, Cypress / MetaMask E2E',
  },
  {
    area: 'Backend',
    items:
      'NestJS, PostgreSQL, Redis, MongoDB, The Graph, relayers, bots, webhooks, payment / PSP integrations, KYC flows, CEX APIs, Docker, CI/CD',
  },
  {
    area: 'Domain',
    items:
      'DeFi lending, leverage, intent settlement (CoW Swap, Uniswap X, 1inch Fusion, Bebop), wallets / account abstraction, ZK / privacy, NFT marketplaces, payments & fintech (PSP integrations, KYC, webhooks, CEX APIs)',
  },
  {
    area: 'Chains',
    items:
      'Ethereum, Arbitrum, Base, Optimism, Polygon, BSC + 40 other EVM; Solana, TON, Tron on side work',
  },
];

export const stats = [
  { value: '10+', label: 'years in production software', hot: false },
  { value: '8', label: 'years in blockchain / web3', hot: true },
  { value: '~30', label: 'engineers hired over the career', hot: false },
  { value: '~$800M', label: 'Multisender.app lifetime volume', hot: false },
  { value: '~$1B', label: 'peak TVL, Tornado Cash', hot: true },
  { value: '~$1M/d', label: 'Liquorice protocol throughput', hot: false },
  { value: '40+', label: 'EVM chains with my contracts live', hot: false },
  { value: '~$300k', label: 'yearly profit, nft.multisender.app (founder)', hot: true },
];

export const career = [
  {
    years: '2024 — 26',
    title: 'Smart Contract Engineer & Technical Advisor — Liquorice',
    hot: false,
    text: 'DeFi lending + intent settlement for market makers (CoW Swap, Uniswap X, 1inch Fusion, Bebop). Wrote the protocol core, ran MixBytes / Pessimistic audits, shipped Ethereum / Arbitrum / Base with no incidents. Dashboard from an empty repo. Deepest Web3 experience on the team, so also reviews, architecture and mentoring. When I disagreed with a request, I said so and laid out the options with their costs. Portugal, remote. Jul 2024 – Aug 2026.',
  },
  {
    years: '2022 — 24',
    title: 'Co-Founder / CTO — zRexFinance',
    hot: false,
    text: 'DeFi leverage up to 10x via Uniswap, 1inch, Aave, Compound. Sole author of the public core-contracts. NestJS + PostgreSQL + The Graph backend. Hired the 3-person frontend team. Angel-funded. MixBytes auditor review before launch. Dubai. Oct 2022 – Jun 2024.',
  },
  {
    years: '2021 — 22',
    title: 'Co-Founder / CTO — NFTxCards',
    hot: false,
    text: 'Collectible-card NFT marketplace. Hired a team of up to 10 from zero. Contracts (ERC-721, orderbook, Chainlink VRF loot boxes, Merkle airdrops) audited by Distributed Lab. Binance NFT launch ~$127K volume, 480+ shop followers. Partnership with Polygon Studios. Tallinn, remote. Jun 2021 – Sep 2022; full-time from Mar 2022.',
  },
  {
    years: '2020 — 22',
    title: 'Software Engineer → Team Lead — PepperSec / Tornado Cash',
    hot: false,
    text: 'Joined on internal tooling; within a year led 3–4 engineers across Tornado Classic / Nova, Multisender and NFT Multisender. Relayer v1 and v2 from scratch, subgraph, CLI, Nova contract work, ZK proofs in Web Workers. Left ~6 months before the 2022 OFAC sanctions — not a bug in the timeline, a fact. Seattle, remote. Mar 2020 – Feb 2022.',
  },
  {
    years: '2018 — 20',
    title: 'Frontend Engineer — SwapOnline · Next · DaoCasino',
    hot: false,
    text: 'SwapOnline (Mar–Dec 2018): #4 contributor to MultiCurrencyWallet, ~900 commits. Next / insentry.io (Jan–Jun 2019): realtime camera overlay. DaoCasino (Jul 2019 – Feb 2020): GraphQL UI generator, Feature-Sliced Design, multi-chain wallet factory, payments stack built from zero (PSP and CEX API integrations, webhooks, KYC). Moscow.',
  },
  {
    years: '2014 — 18',
    title: 'Frontend — Eastec · HTML Academy · Upwork',
    hot: false,
    text: 'Commercial sites and admin panels. Mentoring at HTML Academy — where teaching clicked. Applied Informatics at VSUES, 2013–2017. Through Feb 2018.',
  },
];

export const products = [
  {
    name: 'Liquorice',
    years: '2024–26',
    role: 'protocol core + dashboard',
    proof: '~$1M/day; MixBytes + Pessimistic; ETH / Arb / Base',
  },
  {
    name: 'zRexFinance',
    years: '2022–24',
    role: 'contracts, backend, team',
    proof: 'github.com/zrex-finance/core-contracts, sole author',
    href: 'https://github.com/zrex-finance/core-contracts',
  },
  {
    name: 'NFTxCards',
    years: '2021–22',
    role: 'co-founder, contracts + team',
    proof: 'Binance NFT ~$127K; Polygon Studios; Distributed Lab audit',
    href: 'https://nftxcards.com',
  },
  {
    name: 'Tornado Cash (PepperSec)',
    years: '2020–22',
    role: 'relayer, subgraph, CLI, Nova',
    proof: 'core team; left before OFAC; peak ~$1B TVL',
    href: 'https://github.com/0xZick',
  },
  {
    name: 'Multisender.app',
    years: '2020–24',
    role: 'assembly-optimized bulk sender',
    proof: '~$800M lifetime, 40+ EVM chains',
    href: 'https://multisender.app',
  },
  {
    name: 'nft.multisender.app',
    years: '2021—',
    role: 'founder, ERC-721 / 1155',
    proof: '~$300k/year profit; ~$1M volume in the first 2 years; WalletConnect-verified',
    href: 'https://nft.multisender.app',
  },
  {
    name: 'MultiCurrencyWallet',
    years: '2018',
    role: '#4 contributor, ~900 commits',
    proof: 'in-browser BTC ⇄ ETH atomic swaps',
    href: 'https://github.com/swaponline/MultiCurrencyWallet',
  },
];

export const github = [
  'zrex-finance/core-contracts',
  'tornado-relayer',
  'tornado-nova',
  'tornado-subgraph',
  'tornado-cli',
  'tornado-classic-ui',
  'tornado-anonymity-mining',
  'torn-token',
  'peppersec/erc20faucet',
  'swaponline/MultiCurrencyWallet',
];
