defmodule Teamstory.Repo.Migrations.UpdateIssueTrackersRenameProject do
  use Ecto.Migration

  def change do
    alter table(:issue_trackers) do
      remove :project, :string
      add :name, :string
    end
  end
end
