defmodule TeamstoryWeb.LearningsView do
  use TeamstoryWeb, :view

  def render_item(user, item) do
    %{
      is_you: item.user.id == user.id,
      user_id: item.user.uuid,
      user_name: item.user.name,
      type: item.type,
      start_date: item.start_date,
      end_date: item.end_date,
      content: item.content,
      private: item.private
    }
  end

  def render("list.json", %{user: user, items: items}) do
    %{
      items: items |> Enum.map(fn item -> render_item(user, item) end)
    }
  end

  def render("get.json", %{user: user, item: item}) do
    %{
      item: render_item(user, item)
    }
  end
end
