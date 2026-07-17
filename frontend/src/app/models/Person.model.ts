export enum Role {
    Director = 'Director',
    Actor = 'Actor',
    None = ''
}

export interface Person {
    personId: number,
    fullName: string,
    imagePath: string,
}