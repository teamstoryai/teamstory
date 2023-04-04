defmodule Teamstory.LearningLogFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Teamstory.LearningLog` context.
  """

  @doc """
  Generate a learning.
  """
  def learning_fixture(attrs \\ %{}) do
    {:ok, learning} =
      attrs
      |> Enum.into(%{
        project_id: 1,
        user_id: 1,
        content: "some content",
        end_date: "some end_date",
        private: true,
        start_date: "some start_date",
        type: "some type"
      })
      |> Teamstory.LearningLog.create_learning()

    learning
  end
end
