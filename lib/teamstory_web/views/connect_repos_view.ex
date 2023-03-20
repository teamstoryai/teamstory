defmodule ConcordaWeb.ConnectReposView do
  use ConcordaWeb, :view

  def render_item(item) do
    %{
      id: Concorda.Utils.no_dash(item.uuid),
      name: item.name,
      service: item.service,
      base_url: item.base_url,
      avatar_url: item.avatar_url,
      deleted_at: item.deleted_at
    }
  end

  def render("list.json", %{items: items}) do
    %{
      items: items |> Enum.map(&render_item(&1))
    }
  end

  def render("get.json", %{item: item}) do
    %{
      item: render_item(item)
    }
  end
end
