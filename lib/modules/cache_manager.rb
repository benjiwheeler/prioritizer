  ############################################################
  #                    Monitoring
  ############################################################

module CacheManager
  def self.redis_user_tag_tasks_key(user, tag_str)
    TaskOrdering.redis_tasks_key_prefix(user) +
      '::tag:' + tag_str.to_s + '::task_ids'
  end

  def self.expire_keys!(key_wildcard_str)
    keys = $redis.keys key_wildcard_str
    $redis.del(*keys) unless keys.empty?
  end

  def from_cache_or_generate_list(key)
    cached_list_strs = $redis.lrange(key, 0, -1)
    if cached_list_strs.present?
      return cached_list_strs
    else
      new_list = yield
      Rails.logger.info "now new_list is #{new_list}"
      new_list.each do |item|
        Rails.logger.warn("redis adding item #{item} to key #{key}")
        $redis.rpush(key, item);
      end
      return new_list
    end
  end

  def from_cache_or_generate_int_list(key)
    fetched_list_strs = from_cache_or_generate_list(key)
    fetched_list_strs.map{|str| str.to_i}
  end

end
