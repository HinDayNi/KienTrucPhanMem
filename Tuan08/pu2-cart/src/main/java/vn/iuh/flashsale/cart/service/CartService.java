package vn.iuh.flashsale.cart.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.iuh.flashsale.cart.dto.AddCartRequest;
import vn.iuh.flashsale.cart.dto.CartResponse;
import vn.iuh.flashsale.cart.dto.RemoveCartRequest;
import vn.iuh.flashsale.cart.repository.CartRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

  private final CartRepository repository;

  public CartResponse add(AddCartRequest req) {
    repository.increment(req.userId(), req.productId(), req.quantity());
    log.info("Cart add: user={} product={} qty={}", req.userId(), req.productId(), req.quantity());
    return new CartResponse(req.userId(), repository.get(req.userId()));
  }

  public CartResponse remove(RemoveCartRequest req) {
    repository.decrement(req.userId(), req.productId(), req.quantity());
    log.info("Cart remove: user={} product={} qty={}", req.userId(), req.productId(), req.quantity());
    return new CartResponse(req.userId(), repository.get(req.userId()));
  }

  public CartResponse get(String userId) {
    return new CartResponse(userId, repository.get(userId));
  }

  public void clear(String userId) {
    repository.clear(userId);
  }
}
