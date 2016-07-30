# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160728230911) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attempts", force: :cascade do |t|
    t.integer  "task_id"
    t.boolean  "completed"
    t.decimal  "progress"
    t.boolean  "snoozed"
    t.boolean  "rescheduled"
    t.boolean  "split"
    t.boolean  "addressed"
    t.decimal  "target_dur_mins"
    t.decimal  "actual_dur_mins"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "attempts", ["addressed"], name: "index_attempts_on_addressed", using: :btree
  add_index "attempts", ["completed"], name: "index_attempts_on_completed", using: :btree
  add_index "attempts", ["split"], name: "index_attempts_on_split", using: :btree
  add_index "attempts", ["task_id"], name: "index_attempts_on_task_id", using: :btree

  create_table "authorizations", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.string   "oauth_secret"
    t.string   "name"
    t.string   "nickname"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "location"
    t.string   "description"
    t.string   "image"
    t.string   "phone"
    t.json     "urls"
    t.json     "raw_info"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "authorizations", ["user_id"], name: "index_authorizations_on_user_id", using: :btree

  create_table "taggings", force: :cascade do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context",       limit: 128
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true, using: :btree
  add_index "taggings", ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string  "name"
    t.integer "taggings_count", default: 0
  end

  add_index "tags", ["name"], name: "index_tags_on_name", unique: true, using: :btree

  create_table "tasks", force: :cascade do |t|
    t.string   "name"
    t.text     "notes"
    t.datetime "due"
    t.decimal  "overall_imp"
    t.decimal  "days_imp"
    t.decimal  "weeks_imp"
    t.decimal  "ever_imp"
    t.decimal  "exp_dur_mins"
    t.decimal  "min_dur_mins"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.integer  "parent_id"
    t.integer  "user_id"
    t.integer  "position"
    t.boolean  "done",         default: false
  end

  add_index "tasks", ["due"], name: "index_tasks_on_due", using: :btree
  add_index "tasks", ["exp_dur_mins"], name: "index_tasks_on_exp_dur_mins", using: :btree
  add_index "tasks", ["min_dur_mins"], name: "index_tasks_on_min_dur_mins", using: :btree
  add_index "tasks", ["parent_id"], name: "index_tasks_on_parent_id", using: :btree
  add_index "tasks", ["user_id"], name: "index_tasks_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",       default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "key"
  end

  add_index "users", ["email"], name: "index_users_on_email", using: :btree
  add_index "users", ["key"], name: "index_users_on_key", unique: true, using: :btree

  add_foreign_key "attempts", "tasks"
  add_foreign_key "authorizations", "users"
  add_foreign_key "tasks", "tasks", column: "parent_id"
  add_foreign_key "tasks", "users"
end
