package com.movieticket.movie.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record MovieRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 2000) String description,
        @NotNull @Min(1) Integer durationMinutes,
        @Size(max = 200) String posterUrl,
        LocalDate releaseDate,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal unitPrice
) {}
