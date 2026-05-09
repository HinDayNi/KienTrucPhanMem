package vn.iuh.flashsale.cart.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class CartRepository {

  private static final Duration TTL = Duration.ofHours(1);

  private final RedisTemplate<String, String> redisTemplate;

  private String key(String userId) {
    return "cart:" + userId;
  }

  public void increment(String userId, String productId, int qty) {
    String k = key(userId);
    redisTemplate.opsForHash().increment(k, productId, qty);
    redisTemplate.expire(k, TTL);
  }

  public void decrement(String userId, String productId, int qty) {
    String k = key(userId);
    Object current = redisTemplate.opsForHash().get(k, productId);
    if (current != null) {
      int currentQty = Integer.parseInt(String.valueOf(current));
      int newQty = currentQty - qty;
      if (newQty <= 0) {
        redisTemplate.opsForHash().delete(k, productId);
      } else {
        redisTemplate.opsForHash().put(k, productId, String.valueOf(newQty));
      }
      redisTemplate.expire(k, TTL);
    }
  }

  public Map<String, Integer> get(String userId) {
    Map<Object, Object> raw = redisTemplate.opsForHash().entries(key(userId));
    Map<String, Integer> result = new HashMap<>();
    raw.forEach((k, v) -> result.put(String.valueOf(k), Integer.parseInt(String.valueOf(v))));
    return result;
  }
// Xóa toàn bộ
  public void clear(String userId) {
    redisTemplate.delete(key(userId));
  }
}
