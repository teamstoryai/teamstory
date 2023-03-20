defmodule Teamstory.Repo.Migrations.CreateIssueTrackers do
  use Ecto.Migration

  def change do
    create table(:issue_trackers) do
      add :uuid, :uuid
      add :service, :string
      add :project, :string
      add :base_url, :string
      add :deleted_at, :utc_datetime
      add :project_id, references(:projects, on_delete: :nothing)

      timestamps()
    end

    create index(:issue_trackers, [:uuid])
    create index(:issue_trackers, [:project_id])
  end
end
