module ApplicationHelper

  def tag_with_links(tag_str, is_active, include_tag_in_url)
    style = ""
    if is_active == true
      style = "font-weight: bold"
    end

    path_hash = {}
    if include_tag_in_url == true
      path_hash = {tag: tag_str}
    end

    haml_tag :div do
      haml_concat(link_to(tag_str, tasks_path(path_hash), style: style))
      haml_concat "["
      haml_concat(link_to("see all", tasks_path(path_hash)))
      haml_concat "]"
      haml_concat "["
      haml_concat(link_to("start", next_task_path(path_hash)))
      haml_concat "]"
    end
  end

  def listable_circle_cell(size_f, color_s)
    smallest_size = 3
    scale_factor = 1.5
    size_f = 1 if size_f.blank?
    size_f = scale_factor * (size_f.to_i + smallest_size)/(10.0 + smallest_size)
    spacer_size = scale_factor * smallest_size/(10.0 + smallest_size)
    spacer_size -= size_f / 2.0
    spacer_size += 0.2 # extra spacing
    haml_tag :td, style: "padding-left: .1rem; padding-right: .1rem; padding-top: .7rem; padding-bottom: .5rem; vertical-align: top;" do
      haml_tag :div, class: "circle", style: "background-color: #{color_s}; width: #{size_f}em; height: #{size_f}em; margin-left: #{spacer_size}em; margin-top: #{spacer_size + 0.5}em"
    end
  end

  def form_slider(attribute_s, label_html)
    slider_id = attribute_s + "_slider"
    amount_shown_id = slider_id + "_amount_shown"
    amount_hidden_id = slider_id + "_amount_hidden"
    haml_tag :div, class: "row", style: "margin-top: 5px" do
      haml_tag :div, class: "col-xs-3" do
        haml_tag :div, style: "padding-left: 5px" do
          haml_tag :i, class: "icon-down-right-arrow", style: "float: left; position: relative"
          haml_concat label_html
          haml_tag :span, id: amount_shown_id, style: "border:0; color: #f6931f; font-weight:bold;"
          haml_tag :input, type: "hidden", id: amount_hidden_id, name: "task[#{attribute_s}]", value: "#{@task[attribute_s]}"
        end
      end
      haml_tag :div, class: "field col-xs-9" do # note that "field" probably not necessary
        haml_tag :div, id: slider_id, class: "imp_slider", style: "margin-top: 3px"
      end
    end
  end

  def toggleable_form_section(attribute, actual_detail_level,
    exclude_if_below_level, collapse_if_below_level,
    label_html, input_html)
    return "" if (actual_detail_level < exclude_if_below_level)
    toggle_section_id = "form_" + attribute.to_s + "_toggle_section"
    toggle_off_id = "form_" + attribute.to_s + "_toggle_off"
    toggle_on_id = "form_" + attribute.to_s + "_toggle_on"
    target_section_id = "form_" + attribute.to_s
    if (actual_detail_level < collapse_if_below_level)
      toggle_off_style = "display: inline-block"
      toggle_on_style = "display: none"
    else
      toggle_off_style = "display: none"
      toggle_on_style = "display: inline-block"
    end

    haml_tag :div, class: "row", style: "margin-top: 5px" do
      haml_tag :div, class: "col-xs-3" do
        haml_tag :div, id: toggle_section_id do
          haml_tag :i, id: toggle_off_id, class: "fa fa-caret-right", style: toggle_off_style
          haml_tag :i, id: toggle_on_id, class: "fa fa-caret-down", style: toggle_on_style
          haml_concat label_html
        end
      end
      haml_tag :div, class: "col-xs-9" do
        haml_tag :div, id: target_section_id, style: toggle_on_style do
          haml_concat input_html
        end
      end
    end
  end
end

