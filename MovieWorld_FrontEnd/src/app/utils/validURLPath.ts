export const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png';
export const DEFAULT_MOVIE = 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';

export enum PathType {
  person,
  movie,
}

export function getValidImagePath(path: string | undefined, type: PathType): string {
  const fallback = type === PathType.person ? DEFAULT_AVATAR : DEFAULT_MOVIE;

  if (!path || !path.trim()) {
    return fallback;
  }

  const imageRegex = /\.(jpeg|jpg|gif|png|webp|svg)$/i;
  const isUrl = path.startsWith('http') || path.startsWith('https') || path.startsWith('assets/');

  if (!imageRegex.test(path) && !isUrl) {
    return fallback;
  }

  return path;
}