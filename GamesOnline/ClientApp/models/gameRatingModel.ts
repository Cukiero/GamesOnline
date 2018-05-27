export interface GameRating {
    id: number;
    gameId: number;
    date: Date;
    rating: number;
    comment: string;
    user: User;
}

export interface NewGameRating {
    gameId: number;
    rating: number;
    comment: string;
}

export interface User {
    userId: string;
    userName: string;
    avatarPath: string;
}