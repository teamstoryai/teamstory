defmodule Teamstory.DocsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Teamstory.Docs` context.
  """

  @doc """
  Generate a file.
  """
  def file_fixture(attrs \\ %{}) do
    {:ok, file} =
      attrs
      |> Enum.into(%{
        name: "some name",
        type: 0,
        project_id: 1,
        creator_id: 1
      })
      |> Teamstory.Docs.create_file()

    file
  end

  @doc """
  Generate a doc.
  """
  def doc_fixture(attrs \\ %{}) do
    {:ok, doc} =
      attrs
      |> Enum.into(%{
        contents: "some contents",
        project_id: 1,
      })
      |> Teamstory.Docs.create_doc()

    doc
  end
end
