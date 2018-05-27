export interface Game {
    id: number;
    name: string;
    description: string;
    userViews: number;
    windowType: number;
    path: string;
    imagePath: string;
    rating: number;
    gameCategoryId: number;
    gameCategory: GameCategory;
}

export interface GameCategory {
    id: number;
    name: string;
}

export interface GameCategoryExtended {
    id: number;
    name: string;
    count: number;
}

export interface Score {
    id: number;
    score: number;
    game: Game;
    date: Date;
    isHighScore: number;
}

export interface HighScore {
    id: number;
    score: number;
    gameId: number;
    date: Date;
    user: User;
}

export interface User {
    userId: string;
    userName: string;
    avatarPath: string;
}