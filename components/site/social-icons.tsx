import { cn } from '@/lib/utils'
import { CONTACT } from '@/lib/site'
import { useSiteSettings } from '@/hooks/use-site-settings'

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.73C7 10.96 7.9 12.14 8.02 12.31C8.15 12.48 9.76 15.08 12.3 16.07C14.19 16.81 14.77 16.59 15.34 16.53C16.03 16.47 17.07 15.86 17.29 15.22C17.51 14.58 17.51 14.04 17.44 13.92C17.38 13.81 17.21 13.75 16.96 13.62C16.71 13.5 15.48 12.89 15.25 12.81C15.03 12.72 14.86 12.68 14.7 12.93C14.53 13.17 14.04 13.75 13.89 13.92C13.74 14.09 13.59 14.11 13.34 13.98C13.09 13.86 12.28 13.59 11.32 12.74C10.58 12.08 10.07 11.26 9.93 11.01C9.78 10.76 9.91 10.63 10.04 10.5C10.15 10.39 10.29 10.21 10.42 10.06C10.55 9.91 10.59 9.81 10.67 9.64C10.76 9.47 10.71 9.33 10.65 9.2C10.59 9.08 10.09 7.85 9.89 7.34C9.69 6.84 9.48 6.91 9.33 6.9C9.19 6.9 9.02 6.9 8.85 6.9L8.53 7.33Z" />
    </svg>
  )
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
    </svg>
  )
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.88a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
    </svg>
  )
}

export function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.467 0-5.755-2.522-5.755-6.002 0-3.364 2.228-5.998 5.708-5.998 3.538 0 5.409 2.502 5.409 5.811 0 .531-.073 1.042-.143 1.341h-8.087c.078 1.94 1.455 2.996 3.14 2.996 1.492 0 2.378-.654 2.799-1.148h1.9zm-7.854-3.5h5.195c-.08-1.505-.989-2.5-2.613-2.5-1.599 0-2.457.994-2.582 2.5zm-9.872-6.5h4.949c2.372 0 3.799 1.157 3.799 2.96 0 1.258-.758 2.247-1.896 2.651 1.547.457 2.449 1.637 2.449 3.197 0 2.228-1.782 3.692-4.42 3.692h-4.881v-12.5zm2.84 5.093h1.861c.983 0 1.579-.494 1.579-1.287 0-.825-.624-1.286-1.579-1.286h-1.861v2.573zm0 5.086h1.996c1.171 0 1.879-.537 1.879-1.42 0-.916-.708-1.446-1.879-1.446h-1.996v2.866z" />
    </svg>
  )
}

export const SOCIAL_PLATFORMS = [
  {
    name: 'WhatsApp',
    nameAr: 'واتساب',
    href: CONTACT.whatsapp,
    icon: WhatsAppIcon,
  },
  {
    name: 'Instagram',
    nameAr: 'إنستغرام',
    href: CONTACT.instagram,
    icon: InstagramIcon,
  },
  {
    name: 'Facebook',
    nameAr: 'فيسبوك',
    href: CONTACT.facebook,
    icon: FacebookIcon,
  },
  {
    name: 'LinkedIn',
    nameAr: 'لينكد إن',
    href: CONTACT.linkedin,
    icon: LinkedInIcon,
  },
  {
    name: 'YouTube',
    nameAr: 'يوتيوب',
    href: CONTACT.youtube,
    icon: YouTubeIcon,
  },
]

export function SocialLinks({
  className,
  itemClassName,
  size = 'md',
}: {
  className?: string
  itemClassName?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const { contact } = useSiteSettings()

  const platforms = [
    {
      name: 'WhatsApp',
      nameAr: 'واتساب',
      href: contact.whatsapp,
      icon: WhatsAppIcon,
    },
    {
      name: 'Instagram',
      nameAr: 'إنستغرام',
      href: contact.instagram,
      icon: InstagramIcon,
    },
    {
      name: 'Facebook',
      nameAr: 'فيسبوك',
      href: contact.facebook,
      icon: FacebookIcon,
    },
    {
      name: 'LinkedIn',
      nameAr: 'لينكد إن',
      href: contact.linkedin,
      icon: LinkedInIcon,
    },
    {
      name: 'YouTube',
      nameAr: 'يوتيوب',
      href: contact.youtube,
      icon: YouTubeIcon,
    },
  ]

  const sizeClasses = {
    sm: 'size-8 min-w-[32px] min-h-[32px] [&_svg]:size-3.5',
    md: 'size-10 min-w-[40px] min-h-[40px] [&_svg]:size-4',
    lg: 'size-11 min-w-[44px] min-h-[44px] [&_svg]:size-5',
  }[size]

  return (
    <div className={cn('flex items-center gap-2.5 sm:gap-3 flex-wrap', className)}>
      {platforms.map((platform) => {
        const Icon = platform.icon
        return (
          <a
            key={platform.name}
            href={platform.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`VIWAN on ${platform.name}`}
            title={platform.name}
            className={cn(
              'rounded-full border border-stone/40 bg-white/[0.03] text-muted-foreground hover:text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none',
              sizeClasses,
              itemClassName,
            )}
          >
            <Icon />
          </a>
        )
      })}
    </div>
  )
}
