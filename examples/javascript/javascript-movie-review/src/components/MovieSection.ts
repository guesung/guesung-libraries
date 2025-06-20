import { getAllMovies, getMovies } from "@/apis";
import {
	errorStore,
	movieRateStore,
	moviesResponseStore,
	moviesStore,
	pageStore,
	searchStore,
} from "@/store";
import { html } from "@/utils";
import { Component } from "@guesung/component";

import IntersectionObserble from "./IntersectionObserble";
import MovieDetailModal from "./MovieDetailModal";
import Movies from "./Movies";
import { forEach } from "@fxts/core";

export default class MovieSection extends Component {
	override setup() {
		this.subscribe([moviesStore, errorStore, searchStore]);

		if (searchStore.getState())
			getMovies({ page: pageStore.getState(), query: searchStore.getState() });
		else getAllMovies({ page: pageStore.getState() });

		new MovieDetailModal({ movieRate: movieRateStore.getState() });
	}

	override template() {
		const error = errorStore.getState();
		const search = searchStore.getState();

		if (error) return html`<div class="error">${error.message}</div>`;
		return html`
      <div class="container">
        <main>
          <section>
            <h2 class="thumbnail-title">
              ${search ? `"${search}" 검색 결과` : "지금 인기 있는 영화"}
            </h2>
            <slot name="movies"></slot>
            <slot name="obserable"></slot>
          </section>
        </main>
      </div>
    `;
	}

	override async onRender() {
		this.fillSlot(new Movies(), "movies");
		this.fillSlot(
			new IntersectionObserble({
				callback: async (entries, observer) => {
					forEach(async (entry) => {
						if (!entry.isIntersecting) return;

						const query = searchStore.getState();
						pageStore.setState(pageStore.getState() + 1);

						if (query)
							await getMovies({
								query: searchStore.getState(),
								page: pageStore.getState(),
							});
						if (!query) await getAllMovies({ page: pageStore.getState() });

						const prevMoviesResponse = moviesResponseStore.getState();
						if (
							prevMoviesResponse &&
							prevMoviesResponse.total_pages < pageStore.getState()
						)
							observer.unobserve(entry.target);
					}, entries);
				},
				id: "movie-more",
			}),
			"obserable",
		);
	}
}
