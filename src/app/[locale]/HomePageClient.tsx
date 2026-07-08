"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  Award,
  Axe,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronDown,
  Crown,
  Crosshair,
  Download,
  Flame,
  Hammer,
  HandHeart,
  HeartPulse,
  Lightbulb,
  Repeat,
  Shield,
  Skull,
  Sparkles,
  Sword,
  Target,
  UserCircle,
  UserPlus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  // moduleLinkMap is retained for the server-side props contract (page.tsx still
  // builds it), but homepage modules no longer render internal content links.
  void moduleLinkMap;

  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.echoesofaincradwiki.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Echoes of Aincrad Wiki",
        description:
          "Complete Echoes of Aincrad Wiki covering release date, demo guide, builds, weapons, characters, locations, Death Game Mode, editions, and PC requirements for the SAO action JRPG.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Echoes of Aincrad Wiki - SAO Action JRPG",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Echoes of Aincrad Wiki",
        alternateName: "Echoes of Aincrad",
        url: siteUrl,
        description:
          "Complete Echoes of Aincrad Wiki resource hub for release, demo, builds, weapons, characters, locations, Death Game Mode, and PC requirements",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Echoes of Aincrad Wiki - SAO Action JRPG",
        },
        sameAs: [
          "https://store.steampowered.com/app/2244210/Echoes_of_Aincrad/",
          "https://discord.com/servers/echoes-of-aincrad-1479260152392581163",
          "https://www.reddit.com/r/EchoesofAincrad/",
          "https://x.com/saogames",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Echoes of Aincrad",
        gamePlatform: ["PS5", "Xbox Series X|S", "PC"],
        applicationCategory: "Game",
        genre: ["Action", "JRPG", "Adventure"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/2244210/Echoes_of_Aincrad/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Echoes of Aincrad | Gameplay Trailer",
        description:
          "Official Echoes of Aincrad gameplay trailer from Bandai Namco Entertainment, showcasing combat, weapons, partners, and the floating castle of Aincrad.",
        uploadDate: "2026-06-15",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/h-lqh2-5Ks0",
        url: "https://www.youtube.com/watch?v=h-lqh2-5Ks0",
      },
    ],
  };

  // Combat accordion state
  const [combatExpanded, setCombatExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Module 5 partner / combat-system card icons (each card a distinct icon)
  const partnerCardIcons = [
    UserPlus,
    HandHeart,
    Sword,
    Hammer,
    Axe,
    Crosshair,
    HeartPulse,
    Flame,
    Repeat,
    Target,
  ];

  // Module 3 tier header icons
  const tierIcons = [Crown, Award, Shield];

  // Tools Grid cards map to these section ids (1:1 with t.tools.cards order)
  const sectionIds = [
    "release-date-and-platforms",
    "beginner-guide",
    "weapons-tier-list",
    "combat-and-boss-guide",
    "character-creation-and-partner-guide",
    "death-game-mode-guide",
    "demo-and-save-transfer-guide",
    "editions-and-pre-order-bonus",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("demo-and-save-transfer-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/2244210/Echoes_of_Aincrad/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，展示官方 Gameplay Trailer */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="h-lqh2-5Ks0"
              title="Echoes of Aincrad | Gameplay Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date and Platforms */}
      <section
        id="release-date-and-platforms"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <CalendarCheck className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.echoesReleaseDateAndPlatforms.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.echoesReleaseDateAndPlatforms.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.echoesReleaseDateAndPlatforms.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)]">
                  <th className="text-left p-4 font-semibold">Detail</th>
                  <th className="text-left p-4 font-semibold">Value</th>
                  <th className="text-left p-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.echoesReleaseDateAndPlatforms.items.map(
                  (item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-medium">{item.label}</td>
                      <td className="p-4 text-[hsl(var(--nav-theme-light))] font-semibold">
                        {item.value}
                      </td>
                      <td className="p-4 text-muted-foreground">{item.detail}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.echoesReleaseDateAndPlatforms.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 2: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.echoesBeginnerGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.echoesBeginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.echoesBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.echoesBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 md:flex-col md:items-center">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Tip: </span>
                        {step.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 3: Weapons Tier List */}
      <section
        id="weapons-tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <Sword className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.echoesWeaponsTierList.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.echoesWeaponsTierList.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.echoesWeaponsTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6 md:space-y-8">
            {t.modules.echoesWeaponsTierList.tiers.map(
              (tier: any, ti: number) => {
                const TierIcon = tierIcons[ti];
                return (
                  <div
                    key={ti}
                    className="rounded-xl border border-border overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4 md:p-5 bg-[hsl(var(--nav-theme)/0.1)] border-b border-[hsl(var(--nav-theme)/0.3)]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.2)]">
                        <TierIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                          {tier.tier}
                        </h3>
                        <p className="text-sm text-muted-foreground">{tier.summary}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-5">
                      {tier.weapons.map((w: any, wi: number) => (
                        <div
                          key={wi}
                          className="p-4 md:p-5 bg-white/5 border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                        >
                          <h4 className="font-bold mb-2">{w.name}</h4>
                          <p className="text-xs text-muted-foreground mb-3">{w.role}</p>
                          <dl className="space-y-1.5 text-sm">
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">Shield</dt>
                              <dd className="font-medium">{w.shieldAccess}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">Mobility</dt>
                              <dd className="font-medium">{w.mobility}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">Boss use</dt>
                              <dd className="font-medium">{w.bossUsefulness}</dd>
                            </div>
                          </dl>
                          <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                            {w.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Combat and Boss Guide */}
      <section
        id="combat-and-boss-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <Zap className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.echoesCombatAndBossGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.echoesCombatAndBossGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.echoesCombatAndBossGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2 max-w-3xl mx-auto">
            {t.modules.echoesCombatAndBossGuide.faqs.map(
              (faq: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setCombatExpanded(combatExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-sm md:text-base pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${combatExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {combatExpanded === index && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <p className="text-muted-foreground text-sm mb-3">
                        {faq.answer}
                      </p>
                      <ul className="space-y-1.5">
                        {faq.highlights.map((h: string, hi: number) => (
                          <li key={hi} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Character Creation and Partner Guide */}
      <section
        id="character-creation-and-partner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <UserCircle className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.echoesCharacterAndPartnerGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.echoesCharacterAndPartnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.echoesCharacterAndPartnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.echoesCharacterAndPartnerGuide.cards.map(
              (card: any, index: number) => {
                const CardIcon = partnerCardIcons[index];
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        <CardIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {card.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1.5">{card.title}</h3>
                    {card.weaponType && (
                      <p className="text-xs font-medium text-[hsl(var(--nav-theme-light))] mb-2">
                        Weapon: {card.weaponType}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mb-3">
                      {card.description}
                    </p>
                    <div className="flex items-start gap-2 pt-3 border-t border-border">
                      <Target className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Best for: </span>
                        {card.bestFor}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 6: Death Game Mode Guide */}
      <section
        id="death-game-mode-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <Skull className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.echoesDeathGameModeGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.echoesDeathGameModeGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.echoesDeathGameModeGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 md:pl-8 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.echoesDeathGameModeGuide.steps.map(
              (step: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] md:-left-[1.7rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                        {step.step}
                      </span>
                      <h3 className="font-bold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Tip: </span>
                        {step.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Demo and Save Transfer Guide */}
      <section
        id="demo-and-save-transfer-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <Download className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.echoesDemoAndSaveTransferGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.echoesDemoAndSaveTransferGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.echoesDemoAndSaveTransferGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.echoesDemoAndSaveTransferGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {step.step}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Editions and Pre Order Bonus */}
      <section
        id="editions-and-pre-order-bonus"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <Crown className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.echoesEditionsAndPreOrderBonus.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.echoesEditionsAndPreOrderBonus.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.echoesEditionsAndPreOrderBonus.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)]">
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.edition}
                  </th>
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.steamPriceUsd}
                  </th>
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.baseGame}
                  </th>
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.expansionDlcPass}
                  </th>
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.starterPack}
                  </th>
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.deathGameModeEarlyUnlock}
                  </th>
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.bonusContentsApp}
                  </th>
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.armorPack}
                  </th>
                  <th className="text-left p-3 font-semibold">
                    {t.modules.echoesEditionsAndPreOrderBonus.columns.preOrderBonus}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.echoesEditionsAndPreOrderBonus.rows.map(
                  (row: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3 font-bold text-[hsl(var(--nav-theme-light))]">
                        {row.edition}
                      </td>
                      <td className="p-3 font-medium">{row.steamPriceUsd}</td>
                      <td className="p-3 text-muted-foreground">{row.baseGame}</td>
                      <td className="p-3 text-muted-foreground">{row.expansionDlcPass}</td>
                      <td className="p-3 text-muted-foreground">{row.starterPack}</td>
                      <td className="p-3 text-muted-foreground">
                        {row.deathGameModeEarlyUnlock}
                      </td>
                      <td className="p-3 text-muted-foreground">{row.bonusContentsApp}</td>
                      <td className="p-3 text-muted-foreground">{row.armorPack}</td>
                      <td className="p-3 text-muted-foreground">{row.preOrderBonus}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="scroll-reveal md:hidden space-y-4">
            {t.modules.echoesEditionsAndPreOrderBonus.rows.map(
              (row: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-3">
                    {row.edition}
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {t.modules.echoesEditionsAndPreOrderBonus.columns.steamPriceUsd}
                      </dt>
                      <dd className="font-medium">{row.steamPriceUsd}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {t.modules.echoesEditionsAndPreOrderBonus.columns.baseGame}
                      </dt>
                      <dd className="text-muted-foreground">{row.baseGame}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {t.modules.echoesEditionsAndPreOrderBonus.columns.expansionDlcPass}
                      </dt>
                      <dd className="text-muted-foreground">{row.expansionDlcPass}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {t.modules.echoesEditionsAndPreOrderBonus.columns.starterPack}
                      </dt>
                      <dd className="text-muted-foreground">{row.starterPack}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {t.modules.echoesEditionsAndPreOrderBonus.columns.deathGameModeEarlyUnlock}
                      </dt>
                      <dd className="text-muted-foreground">
                        {row.deathGameModeEarlyUnlock}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {t.modules.echoesEditionsAndPreOrderBonus.columns.bonusContentsApp}
                      </dt>
                      <dd className="text-muted-foreground">{row.bonusContentsApp}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {t.modules.echoesEditionsAndPreOrderBonus.columns.armorPack}
                      </dt>
                      <dd className="text-muted-foreground">{row.armorPack}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        {t.modules.echoesEditionsAndPreOrderBonus.columns.preOrderBonus}
                      </dt>
                      <dd className="text-muted-foreground">{row.preOrderBonus}</dd>
                    </div>
                  </dl>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/servers/echoes-of-aincrad-1479260152392581163"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/saogames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/EchoesofAincrad/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/2244210/Echoes_of_Aincrad/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
