import Script from 'next/script'

/**
 * Google Analytics (GA4) Integration Component
 *
 * Automatically activates when NEXT_PUBLIC_GA_ID is set in .env / .env.local
 * Uses Next.js Script with 'afterInteractive' strategy for optimal performance without blocking page load.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-3RV9VLSJS8'

  // If no Measurement ID is configured, render nothing
  if (!gaId || gaId.trim() === '') {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

/**
 * Utility helper to track custom conversions and user events
 * e.g. trackEvent('consultation_click', 'Consultation', 'Book Consultation Button')
 */
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
