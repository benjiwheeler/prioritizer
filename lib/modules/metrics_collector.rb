  ############################################################
  #                    Monitoring
  ############################################################

require "benchmark"
module MetricsCollector
  def collect_metrics(metric_name_param = nil)
    # time = Benchmark.measure do
    #   yield  #requests
    # end
    start = Time.now
    yield
    duration = Time.now - start
    metric_name = metric_name_param
    if metric_name_param.blank?
      metric_name = "#{controller_name}##{action_name}"
    end
    Rails.logger.info "duration of #{metric_name}: #{duration}s"
  end

end
