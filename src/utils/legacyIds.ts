// PDF entries used to be numbered by their position in dictionary.json
// ("imp_0", "imp_1", ...), so every re-import shifted them. They now have
// stable content-based IDs ("pdf_..."). legacy_pdf_ids.json maps each old
// number to its new ID so saved favourites and shared links keep working.
// It is loaded only when an old ID actually turns up.

const LEGACY_ID = /^imp_(\d+)$/;

export const isLegacyId = (id: string): boolean => LEGACY_ID.test(id);

let mapPromise: Promise<(string | null)[]> | null = null;
const loadMap = () => (mapPromise ??= import('../data/legacy_pdf_ids.json').then(m => m.default));

/** The current ID for an old "imp_N" ID, or undefined if there is none. */
export const resolveLegacyId = async (id: string): Promise<string | undefined> => {
    const match = LEGACY_ID.exec(id);
    if (!match) return undefined;
    const map = await loadMap();
    return map[Number(match[1])] ?? undefined;
};

/**
 * Rewrites any old IDs in a list to current ones, dropping those with no
 * successor and any duplicates the rewrite creates.
 */
export const migrateLegacyIds = async (ids: string[]): Promise<string[]> => {
    if (!ids.some(isLegacyId)) return ids;
    const resolved = await Promise.all(ids.map(id => (isLegacyId(id) ? resolveLegacyId(id) : id)));
    return [...new Set(resolved.filter((id): id is string => !!id))];
};
