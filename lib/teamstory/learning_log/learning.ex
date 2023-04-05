defmodule Teamstory.LearningLog.Learning do
  use Ecto.Schema
  import Ecto.Changeset

  alias Teamstory.{Projects.Project, Users.User}

  schema "learnings" do
    field :content, :string
    field :end_date, :string
    field :private, :boolean, default: false
    field :start_date, :string
    field :type, :string

    belongs_to :user, User
    belongs_to :project, Project

    timestamps()
  end

  @doc false
  def changeset(learning, attrs) do
    learning
    |> cast(attrs, [:project_id, :user_id, :type, :start_date, :end_date, :content, :private])
    |> validate_required([:project_id, :user_id, :type, :start_date, :end_date, :content])
  end
end
