import { useEffect } from 'react';
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../utils/seo';

/**
 * Sets the document title, meta description, and canonical URL for a page,
 * restoring the site-wide defaults on unmount so a stale page title never
 * carries over to the next route.
 */
export const usePageMeta = (title: string, description: string, path: string) => {
    useEffect(() => {
        const descTag = document.querySelector('meta[name="description"]');
        const canonical = document.querySelector('link[rel="canonical"]');

        document.title = `${title} - Awal Dictionary`;
        descTag?.setAttribute('content', description);
        canonical?.setAttribute('href', `${SITE_URL}${path}`);

        return () => {
            document.title = DEFAULT_TITLE;
            descTag?.setAttribute('content', DEFAULT_DESCRIPTION);
            canonical?.setAttribute('href', `${SITE_URL}/`);
        };
    }, [title, description, path]);
};
