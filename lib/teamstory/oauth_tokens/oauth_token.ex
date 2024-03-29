defmodule Teamstory.OAuthTokens.OAuthToken do
  use Ecto.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{}

  schema "oauth_tokens" do
    field :email, :string
    field :access, :string
    field :deleted_at, :utc_datetime
    field :expires_at, :utc_datetime
    field :meta, :map
    field :name, :string
    field :refresh, :string

    belongs_to :user, Teamstory.Users.User
    belongs_to :project, Teamstory.Projects.Project

    timestamps()
  end

  @doc false
  def changeset(oauth_token, attrs) do
    oauth_token
    |> cast(attrs, [
      :user_id,
      :project_id,
      :email,
      :access,
      :expires_at,
      :deleted_at,
      :name,
      :refresh,
      :meta
    ])
    |> validate_required([:user_id, :name])
  end
end
