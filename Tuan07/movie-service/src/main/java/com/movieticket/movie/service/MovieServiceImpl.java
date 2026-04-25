package com.movieticket.movie.service;

import com.movieticket.movie.domain.Movie;
import com.movieticket.movie.dto.MovieRequest;
import com.movieticket.movie.dto.MovieResponse;
import com.movieticket.movie.dto.PageResponse;
import com.movieticket.movie.exception.AppException;
import com.movieticket.movie.repository.MovieRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    @Override
    public PageResponse<MovieResponse> list(int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 100);
        Page<Movie> result = movieRepository.findAll(
                PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt")));
        return new PageResponse<>(
                result.getContent().stream().map(MovieServiceImpl::toResponse).toList(),
                safePage, safeSize, result.getTotalElements());
    }

    @Override
    public MovieResponse getById(String id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public MovieResponse create(MovieRequest request) {
        Instant now = Instant.now();
        Movie movie = Movie.builder()
                .id("m-" + UUID.randomUUID().toString().substring(0, 8))
                .title(request.title())
                .description(request.description())
                .durationMinutes(request.durationMinutes())
                .posterUrl(request.posterUrl())
                .releaseDate(request.releaseDate())
                .unitPrice(request.unitPrice())
                .createdAt(now)
                .updatedAt(now)
                .build();
        Movie saved = movieRepository.save(movie);
        log.info("Created movie {} ({})", saved.getId(), saved.getTitle());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public MovieResponse update(String id, MovieRequest request) {
        Movie movie = findOrThrow(id);
        movie.setTitle(request.title());
        movie.setDescription(request.description());
        movie.setDurationMinutes(request.durationMinutes());
        movie.setPosterUrl(request.posterUrl());
        movie.setReleaseDate(request.releaseDate());
        movie.setUnitPrice(request.unitPrice());
        movie.setUpdatedAt(Instant.now());
        return toResponse(movie);
    }

    private Movie findOrThrow(String id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND,
                        "MOVIE_NOT_FOUND", "Movie #" + id + " not found"));
    }

    private static MovieResponse toResponse(Movie m) {
        return new MovieResponse(m.getId(), m.getTitle(), m.getDescription(),
                m.getDurationMinutes(), m.getPosterUrl(), m.getReleaseDate(),
                m.getUnitPrice(), m.getCreatedAt(), m.getUpdatedAt());
    }
}
