defmodule TeamstoryWeb.AuthView do
  use TeamstoryWeb, :view

  def render_user(user) do
    %{
      id: user.uuid,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      profile_img: user.profile_img,
      meta: user.meta,
      timezone: user.timezone
    }
  end

  def render("token.json", params) do
    %{
      success: if(Map.has_key?(params, :success), do: params[:success], else: true),
      token: params[:token],
      user: render_user(params[:user])
    }
  end

  def render("user.json", %{user: user}) do
    %{
      item: render_user(user)
    }
  end
end
