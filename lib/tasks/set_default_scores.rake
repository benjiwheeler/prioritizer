task :set_default_scores => :environment do
  Task.all.each do |task|
    task.vital = task.ever_imp
    task.immediate = (2.0 * task.days_imp + 1.0 * task.weeks_imp) / 3.0
    task.heavy = 3.0
    task.long = 3.0
    task.save
  end
end
