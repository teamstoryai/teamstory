defmodule TeamstoryWeb.OAuthView do
  use TeamstoryWeb, :view

  def render_token(nil), do: nil

  def render_token(token) do
    %{
      name: token.name,
      email: token.email,
      access: token.access,
      expires_at: token.expires_at,
      meta: token.meta
    }
  end

  def render("token.json", %{token: token}) do
    %{
      item: render_token(token)
    }
  end

  def render("tokens.json", %{tokens: tokens}) do
    %{
      items: tokens |> Enum.map(&render_token/1)
    }
  end
end
