package vn.iuh.flashsale.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AddCartRequest(
    @NotBlank String userId,
    @NotBlank @Pattern(regexp = "^p\\d{3}$") String productId,
    @Min(1) int quantity) {}
