defmodule Teamstory.ProjectsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Teamstory.Projects` context.
  """

  @doc """
  Generate a project.
  """
  def project_fixture(attrs \\ %{}) do
    {:ok, project} =
      attrs
      |> Enum.into(%{
        archived_at: ~U[2022-07-13 06:12:00Z],
        meta: %{},
        name: "some name",
        shortcode: "SN",
        creator_id: 1
      })
      |> Teamstory.Projects.create_project()

    project
  end

  @doc """
  Generate a user_project.
  """
  def user_project_fixture(attrs \\ %{}) do
    {:ok, user_project} =
      attrs
      |> Enum.into(%{
        role: "some role",
        project_id: 1,
        user_id: 1
      })
      |> Teamstory.Projects.create_user_project()

    user_project
  end

  @doc """
  Generate a project_invite.
  """
  def project_invite_fixture(attrs \\ %{}) do
    {:ok, project_invite} =
      attrs
      |> Enum.into(%{
        project_id: 1,
        creator_id: 1,
        code: "some code",
        email: "some email",
        role: "member"
      })
      |> Teamstory.Projects.create_project_invite()

    project_invite
  end

  @doc """
  Generate a project_data.
  """
  def project_data_fixture(attrs \\ %{}) do
    {:ok, project_data} =
      attrs
      |> Enum.into(%{
        project_id: 1,
        key: "some key",
        value: %{}
      })
      |> Teamstory.Projects.create_project_data()

    project_data
  end
end
