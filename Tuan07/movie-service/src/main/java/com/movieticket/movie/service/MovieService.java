package com.movieticket.movie.service;

import com.movieticket.movie.dto.MovieRequest;
import com.movieticket.movie.dto.MovieResponse;
import com.movieticket.movie.dto.PageResponse;

public interface MovieService {

    PageResponse<MovieResponse> list(int page, int size);

    MovieResponse getById(String id);

    MovieResponse create(MovieRequest request);

    MovieResponse update(String id, MovieRequest request);
}
