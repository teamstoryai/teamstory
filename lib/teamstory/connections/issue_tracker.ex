defmodule Teamstory.Connections.IssueTracker do
  use Ecto.Schema
  import Ecto.Changeset

  schema "issue_trackers" do
    field :deleted_at, :utc_datetime
    field :project, :string
    field :project_id, :string
    field :service, :string
    field :uuid, Ecto.UUID
    field :project_id, :id

    timestamps()
  end

  @doc false
  def changeset(issue_tracker, attrs) do
    issue_tracker
    |> cast(attrs, [:uuid, :service, :project, :project_id, :deleted_at])
    |> validate_required([:uuid, :service, :project, :project_id, :deleted_at])
  end
end
