export interface UsersFilter {
    query : string,
    role: number,
    year: number
}

export const DEFAULT_USERS_FILTER : UsersFilter = {
    query: '',
    role:-1,
    year: -1
}