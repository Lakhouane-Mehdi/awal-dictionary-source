// Author details, kept in one place so the footer, About page, and any
// future credit surface never drift apart.

export const AUTHOR = {
    name: 'Mehdi Lakhouane',
    website: 'https://mehdilakhouane.com',
    websiteLabel: 'mehdilakhouane.com',
    github: 'https://github.com/Lakhouane-Mehdi',
    githubLabel: 'Lakhouane-Mehdi',
} as const;

/** The dictionary's own source repository, distinct from the author profile. */
export const PROJECT_REPO = 'https://github.com/Amazigh24/awal-dictionary-source';

/**
 * Contributions are routed to GitHub issues rather than email, so there is no
 * address to maintain and submissions stay public and trackable.
 */
export const PROJECT_ISSUES = `${PROJECT_REPO}/issues`;

export const newIssueUrl = (title: string, body: string): string =>
    `${PROJECT_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
