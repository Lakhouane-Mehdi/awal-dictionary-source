/**
 * GitHub mark as an inline SVG.
 *
 * lucide-react deprecated all brand icons and will remove them in v1.0
 * (lucide-icons/lucide#670), so this avoids a break on a future upgrade.
 */
export const GithubIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={className}
    >
        <path d="M12 .5C5.73.5.9 5.48.9 11.92c0 5.05 3.29 9.33 7.86 10.84.57.1.78-.26.78-.57v-2c-3.2.71-3.87-1.44-3.87-1.44-.53-1.37-1.29-1.74-1.29-1.74-1.05-.74.08-.72.08-.72 1.16.08 1.77 1.22 1.77 1.22 1.03 1.81 2.7 1.29 3.36.99.1-.77.4-1.29.73-1.59-2.55-.29-5.24-1.31-5.24-5.83 0-1.29.44-2.34 1.17-3.17-.12-.3-.51-1.5.11-3.12 0 0 .96-.32 3.15 1.21a10.7 10.7 0 0 1 5.74 0c2.18-1.53 3.14-1.21 3.14-1.21.62 1.62.23 2.82.12 3.12.73.83 1.17 1.88 1.17 3.17 0 4.53-2.7 5.53-5.26 5.82.41.37.78 1.1.78 2.22v3.29c0 .31.21.68.79.57 4.56-1.52 7.85-5.79 7.85-10.84C23.1 5.48 18.27.5 12 .5Z" />
    </svg>
);
