defmodule Teamstory.Projects.ProjectData do
  use Ecto.Schema
  import Ecto.Changeset

  schema "project_data" do
    field :key, :string
    field :value, :map
    field :project_id, :id

    timestamps()
  end

  @doc false
  def changeset(project_data, attrs) do
    project_data
    |> cast(attrs, [:project_id, :key, :value])
    |> validate_required([:project_id, :key, :value])
    |> unique_constraint([:project_id, :key], message: "+ key already exists")
  end
end
