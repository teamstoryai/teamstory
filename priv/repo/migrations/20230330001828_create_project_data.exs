defmodule Teamstory.Repo.Migrations.CreateProjectData do
  use Ecto.Migration

  def change do
    create table(:project_data) do
      add :key, :string
      add :value, :map
      add :project_id, references(:projects, on_delete: :nothing)

      timestamps()
    end

    create index(:project_data, [:project_id])
    create unique_index(:project_data, [:project_id, :key])
  end
end
