import pkg from '../../package.json';

export const APP_VERSION = pkg.version;

// Vercel injects this automatically at build time for every deployment —
// no manual bump needed, so the label changes on every release on its own.
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA;
export const APP_BUILD = commitSha ? commitSha.slice(0, 7) : 'dev';

export const APP_VERSION_LABEL = `v${APP_VERSION}+${APP_BUILD}`;
