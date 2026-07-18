export interface Review {
    id: number;
    movieId: number;
    userId: number;
    userName: string;
    userImagePath: string;
    rating: number;
    comment: string;
    createdAt: string;
}
