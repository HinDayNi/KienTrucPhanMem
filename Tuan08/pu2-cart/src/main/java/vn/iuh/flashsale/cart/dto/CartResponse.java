package vn.iuh.flashsale.cart.dto;

import java.util.Map;

public record CartResponse(String userId, Map<String, Integer> items) {}
