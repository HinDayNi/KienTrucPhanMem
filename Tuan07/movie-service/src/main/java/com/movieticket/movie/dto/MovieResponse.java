package com.movieticket.movie.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record MovieResponse(
        String id,
        String title,
        String description,
        Integer durationMinutes,
        String posterUrl,
        LocalDate releaseDate,
        BigDecimal unitPrice,
        Instant createdAt,
        Instant updatedAt
) {}
