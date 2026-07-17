export enum Roles {
    "director",
    "actor"
}

export interface Actor {
    id: number,
    name: string,
    imagePath: string,
    role: Roles
}