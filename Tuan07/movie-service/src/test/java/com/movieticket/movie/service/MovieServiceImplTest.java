package com.movieticket.movie.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.movieticket.movie.domain.Movie;
import com.movieticket.movie.dto.MovieRequest;
import com.movieticket.movie.dto.MovieResponse;
import com.movieticket.movie.dto.PageResponse;
import com.movieticket.movie.exception.AppException;
import com.movieticket.movie.repository.MovieRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class MovieServiceImplTest {

    @Mock private MovieRepository movieRepository;
    @InjectMocks private MovieServiceImpl service;

    @Test
    void list_shouldReturnPaged() {
        Movie m = Movie.builder().id("m-1").title("Inception")
                .durationMinutes(148).unitPrice(new BigDecimal("120000"))
                .createdAt(Instant.now()).updatedAt(Instant.now()).build();
        Page<Movie> page = new PageImpl<>(List.of(m), Pageable.unpaged(), 1L);
        when(movieRepository.findAll(any(Pageable.class))).thenReturn(page);

        PageResponse<MovieResponse> resp = service.list(0, 20);

        assertThat(resp.items()).hasSize(1);
        assertThat(resp.total()).isEqualTo(1L);
        assertThat(resp.items().get(0).title()).isEqualTo("Inception");
    }

    @Test
    void create_shouldGenerateIdAndPersist() {
        when(movieRepository.save(any(Movie.class))).thenAnswer(i -> i.getArgument(0));
        MovieRequest req = new MovieRequest("Dune 2", "desc", 166, "http://poster",
                LocalDate.of(2024, 3, 1), new BigDecimal("140000"));

        MovieResponse resp = service.create(req);

        assertThat(resp.id()).startsWith("m-");
        assertThat(resp.title()).isEqualTo("Dune 2");
    }

    @Test
    void getById_shouldThrowWhenNotFound() {
        when(movieRepository.findById("nope")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.getById("nope"))
                .isInstanceOf(AppException.class)
                .hasMessageContaining("not found");
    }
}
