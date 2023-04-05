defmodule Teamstory.Repo.Migrations.CreateLearnings do
  use Ecto.Migration

  def change do
    create table(:learnings) do
      add :type, :string
      add :start_date, :string
      add :end_date, :string
      add :content, :text
      add :private, :boolean, default: false, null: false
      add :project_id, references(:projects, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:learnings, [:project_id])
    create index(:learnings, [:user_id])
    create index(:learnings, [:project_id, :type, :start_date, :end_date, :private])
  end
end
