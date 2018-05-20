export interface GameRating {
    id: number;
    gameId: number;
    date: Date;
    rating: number;
    comment: string;
    applicationUserId: string;
    applicationUserName: string;
}

export interface NewGameRating {
    gameId: number;
    rating: number;
    comment: string;
}