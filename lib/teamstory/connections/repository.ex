defmodule Teamstory.Connections.Repository do
  use Ecto.Schema
  import Ecto.Changeset

  schema "repositories" do
    field :uuid, Ecto.UUID
    field :avatar_url, :string
    field :base_url, :string
    field :deleted_at, :utc_datetime
    field :name, :string
    field :service, :string
    field :project_id, :id

    timestamps()
  end

  @doc false
  def changeset(repository, attrs) do
    repository
    |> cast(attrs, [:service, :avatar_url, :name, :base_url, :deleted_at, :project_id])
    |> Teamstory.Repo.generate_uuid()
    |> validate_required([:uuid, :service, :name, :project_id])
    |> unique_constraint([:project_id, :base_url])
  end
end
