defmodule Teamstory.ConnectionsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Teamstory.Connections` context.
  """

  @doc """
  Generate a repository.
  """
  def repository_fixture(attrs \\ %{}) do
    {:ok, repository} =
      attrs
      |> Enum.into(%{
        avatar_url: "some avatar_url",
        base_url: "some base_url",
        deleted_at: ~U[2023-03-19 21:30:00Z],
        name: "some name",
        service: "some service"
      })
      |> Teamstory.Connections.create_repository()

    repository
  end

  @doc """
  Generate a issue_tracker.
  """
  def issue_tracker_fixture(attrs \\ %{}) do
    {:ok, issue_tracker} =
      attrs
      |> Enum.into(%{
        deleted_at: ~U[2023-03-19 21:42:00Z],
        project: "some project",
        project_id: "some project_id",
        service: "some service",
        uuid: "7488a646-e31f-11e4-aace-600308960662"
      })
      |> Teamstory.Connections.create_issue_tracker()

    issue_tracker
  end
end
