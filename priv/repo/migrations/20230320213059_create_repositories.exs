defmodule Teamstory.Repo.Migrations.CreateRepositories do
  use Ecto.Migration

  def change do
    create table(:repositories) do
      add :uuid, :uuid
      add :service, :string
      add :avatar_url, :string
      add :name, :string
      add :base_url, :string
      add :deleted_at, :utc_datetime
      add :project_id, references(:projects, on_delete: :nothing)

      timestamps()
    end

    create index(:repositories, [:uuid])
    create index(:repositories, [:project_id])
    create unique_index(:repositories, [:project_id, :base_url])
  end
end
