const configuredBase = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
const repositoryPath = '/Fornak-Indonesia';
const repositoryHost = typeof location !== 'undefined' && location.hostname.endsWith('.github.io');
const base = configuredBase || (repositoryHost ? repositoryPath : '');

export function sitePath(path: string) {
  return base + path;
}

export function routePath(pathname: string) {
  const prefix = base || repositoryPath;
  const local = pathname === prefix || pathname.startsWith(prefix + '/') ? pathname.slice(prefix.length) : pathname;
  return local.replace(/\/$/, '') || '/';
}
