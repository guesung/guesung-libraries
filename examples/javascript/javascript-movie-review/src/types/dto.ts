// 영화 목록 / 영화 검색
export interface MoviesResponse {
	page: number;
	results: MovieType[];
	total_pages: number;
	total_results: number;
}

export type MovieType = {
	adult: boolean;
	backdrop_path?: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

// 영화 상세 정보

export interface MovieDetailResponse {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: null;
	budget: number;
	genres: GenreType[];
	homepage: string;
	id: number;
	imdb_id: string;
	origin_country: string[];
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompanyType[];
	production_countries: ProductionCountryType[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: SpokenLanguageType[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}
export type GenreType = {
	id: number;
	name: string;
};
export type ProductionCompanyType = {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
};
export type ProductionCountryType = {
	iso_3166_1: string;
	name: string;
};
export type SpokenLanguageType = {
	english_name: string;
	iso_639_1: string;
	name: string;
};
