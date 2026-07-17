export interface NewsFilter {
    query : string | null,
    movieQuery : string | null,
    actorQuery : string | null,
    year: number
}

export const DEFAULT_NEWS_FILTER : NewsFilter = {
    query: '',
    movieQuery: '',
    actorQuery: '',
    year: 0
}