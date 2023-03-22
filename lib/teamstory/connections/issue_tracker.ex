defmodule Teamstory.Connections.IssueTracker do
  use Ecto.Schema
  import Ecto.Changeset

  schema "issue_trackers" do
    field :deleted_at, :utc_datetime
    field :project, :string
    field :base_url, :string
    field :service, :string
    field :uuid, Ecto.UUID
    field :project_id, :id

    timestamps()
  end

  @doc false
  def changeset(issue_tracker, attrs) do
    issue_tracker
    |> cast(attrs, [:uuid, :service, :project, :project_id, :base_url, :deleted_at])
    |> Teamstory.Repo.generate_uuid()
    |> validate_required([:uuid, :service, :project, :project_id, :base_url])
    |> unique_constraint([:project_id, :base_url], message: "+ issue tracker already exists")
  end
end
