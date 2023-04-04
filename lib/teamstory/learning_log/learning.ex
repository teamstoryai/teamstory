defmodule Teamstory.LearningLog.Learning do
  use Ecto.Schema
  import Ecto.Changeset

  schema "learnings" do
    field :content, :string
    field :end_date, :string
    field :private, :boolean, default: false
    field :start_date, :string
    field :type, :string
    field :project_id, :id
    field :user_id, :id

    timestamps()
  end

  @doc false
  def changeset(learning, attrs) do
    learning
    |> cast(attrs, [:project_id, :user_id, :type, :start_date, :end_date, :content, :private])
    |> validate_required([:project_id, :user_id, :type, :start_date, :end_date, :content])
  end
end
