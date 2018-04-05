export interface Game {
    id: number;
    name: string;
    description: string;
    userViews: number;
    gameType: number;
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