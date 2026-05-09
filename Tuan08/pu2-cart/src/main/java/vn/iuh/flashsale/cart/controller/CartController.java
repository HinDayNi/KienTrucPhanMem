package vn.iuh.flashsale.cart.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.iuh.flashsale.cart.dto.AddCartRequest;
import vn.iuh.flashsale.cart.dto.CartResponse;
import vn.iuh.flashsale.cart.dto.RemoveCartRequest;
import vn.iuh.flashsale.cart.service.CartService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CartController {

  private final CartService service;

  @PostMapping("/cart/add")
  public CartResponse add(@RequestBody @Valid AddCartRequest req) {
    return service.add(req);
  }

  @PostMapping("/cart/remove")
  public CartResponse remove(@RequestBody @Valid RemoveCartRequest req) {
    return service.remove(req);
  }

  @GetMapping("/cart")
  public CartResponse get(@RequestParam String userId) {
    return service.get(userId);
  }

  @DeleteMapping("/cart/{userId}")
  public Map<String, Boolean> clear(@PathVariable String userId) {
    service.clear(userId);
    return Map.of("deleted", true);
  }

  @GetMapping("/health")
  public Map<String, String> health() {
    return Map.of("status", "UP", "service", "pu2-cart");
  }
}
