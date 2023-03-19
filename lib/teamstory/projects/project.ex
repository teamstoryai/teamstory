defmodule Teamstory.Projects.Project do
  use Ecto.Schema
  import Ecto.Changeset

  alias Teamstory.{Repo, Users.User}

  @type t :: %__MODULE__{}

  schema "projects" do
    field :uuid, Ecto.UUID
    field :archived_at, :utc_datetime
    field :deleted_at, :utc_datetime
    field :meta, :map
    field :name, :string

    belongs_to :creator, User

    timestamps()
  end

  @doc false
  def changeset(project, attrs) do
    project
    |> cast(attrs, [:uuid, :creator_id, :name, :archived_at, :deleted_at, :meta])
    |> Repo.generate_uuid()
    |> validate_required([:uuid, :creator_id, :name])
    |> validate_length(:name, min: 1, max: 50)
  end
end
