module ApplicationHelper

  def tag_with_links(tag, is_active, include_tag_in_url)
    style = ""
    if is_active == true
      style = "font-weight: bold"
    end

    path_hash = {}
    if include_tag_in_url == true
      path_hash = {tag: tag.name}
    end

    haml_tag :div do
      haml_concat(link_to(tag.name, tasks_path(path_hash), style: style))
      haml_concat "["
      haml_concat(link_to("see all", tasks_path(path_hash)))
      haml_concat "]"
      haml_concat "["
      haml_concat(link_to("start", next_task_path(path_hash)))
      haml_concat "]"
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

