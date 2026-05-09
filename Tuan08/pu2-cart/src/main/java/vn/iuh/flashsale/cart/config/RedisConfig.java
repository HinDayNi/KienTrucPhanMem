package vn.iuh.flashsale.cart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

  @Bean
  public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory cf) {
    RedisTemplate<String, String> template = new RedisTemplate<>();
    template.setConnectionFactory(cf);
    StringRedisSerializer ser = new StringRedisSerializer();
    template.setKeySerializer(ser);
    template.setHashKeySerializer(ser);
    template.setValueSerializer(ser);
    template.setHashValueSerializer(ser);
    template.afterPropertiesSet();
    return template;
  }
}
