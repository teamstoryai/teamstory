defmodule Teamstory.Repo.Migrations.UpdateOauthTokensAddProjectId do
  use Ecto.Migration

  def change do
    alter table(:oauth_tokens) do
      add :project_id, references(:projects, on_delete: :nothing)
    end

    create index(:oauth_tokens, [:project_id])
    create index(:oauth_tokens, [:project_id, :name, :deleted_at])
  end
end
