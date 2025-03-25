export interface HikeImage {
    id: number;
    image_url: string;
}

export interface HikePreview {
    id: number;
    title: string;
    difficulty: HikeDifficulty;
    distance: number;
    duration: number;
    municipality: string;
    highest_point: number;
    lowest_point: number;
    latitude: number;
    longitude: number;
    images: HikeImage[];
}

export interface Hike {
    id: number;
    title: string;
    excerpt: string;
    description: string;
    activity_type: string;
    difficulty: string;
    distance: number;
    duration: number;
    positive_elevation: number;
    negative_elevation: number;
    municipality: string;
    highest_point: number;
    lowest_point: number;
    latitude: number;
    longitude: number;
    ign_reference: string;
    hike_url: string;
    gpx_url: string;
    is_return_starting_point: boolean;
    images: HikeImage[];
}

export interface HikeQueryFilters {
    duration?: number;
    difficulty?: HikeDifficulty;
    distance?: number;
    radius: number;
}

export interface HikeComparaisonFilters {
    duration?: HikeComparaison;
    distance?: HikeComparaison;
}


export enum HikeComparaison {
    GreaterOrEqual = 'gte',
    LessOrEqual = 'lte',
}


export enum HikeDifficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

export const HikeDifficultyTitle = {
    [HikeDifficulty.EASY]: "Facile",
    [HikeDifficulty.MEDIUM]: "Moyenne",
    [HikeDifficulty.HARD]: "Difficile",
};
