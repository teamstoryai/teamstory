defmodule Teamstory.Repo.Migrations.CreateOauthTokens do
  use Ecto.Migration

  def change do
    create table(:oauth_tokens) do
      add :email, :string
      add :access, :string
      add :expires_at, :naive_datetime
      add :deleted_at, :naive_datetime
      add :name, :string
      add :refresh, :string
      add :meta, :map
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:oauth_tokens, [:user_id])
    create index(:oauth_tokens, [:user_id, :name, :email])
    create index(:oauth_tokens, [:user_id, :name, :deleted_at])
  end
end
