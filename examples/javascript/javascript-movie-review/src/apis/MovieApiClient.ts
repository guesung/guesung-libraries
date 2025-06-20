import type { MovieDetailResponse, MoviesResponse } from "@/types";
import ApiClient from "./ApiClient";
import { CONFIG, TMDB_ORIGIN } from "@/constants";

interface GetAllRequest {
	page: number;
}

interface GetRequest {
	page: number;
	query: string;
}

interface GetDetailRequest {
	id: number;
}

export default class MovieApiClient {
	static #OPTIONS = {
		headers: { Authorization: `Bearer ${CONFIG.tmdbToken}` },
	};

	static getAll({ page }: GetAllRequest) {
		const url = new URL("/3/movie/popular", TMDB_ORIGIN);
		url.searchParams.append("page", String(page));
		url.searchParams.append("language", navigator.language);

		return ApiClient.get<MoviesResponse>(url, MovieApiClient.#OPTIONS);
	}

	static get({ page, query }: GetRequest) {
		const url = new URL("/3/search/movie", TMDB_ORIGIN);
		url.searchParams.append("page", String(page));
		url.searchParams.append("language", navigator.language);
		url.searchParams.append("query", query);

		return ApiClient.get<MoviesResponse>(url, MovieApiClient.#OPTIONS);
	}

	static getDetail({ id }: GetDetailRequest) {
		const url = new URL(`/3/movie/${id}`, TMDB_ORIGIN);
		url.searchParams.append("language", navigator.language);

		return ApiClient.get<MovieDetailResponse>(url, MovieApiClient.#OPTIONS);
	}
}
