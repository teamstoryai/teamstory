defmodule TeamstoryWeb.ProjectsView do
  use TeamstoryWeb, :view

  def render_project(project, _user) do
    %{
      id: Teamstory.Utils.no_dash(project.uuid),
      name: project.name,
      archived_at: project.archived_at
    }
  end

  def render("list.json", %{projects: projects, user: user}) do
    %{
      user: TeamstoryWeb.AuthView.render_user(user),
      projects: projects |> Enum.map(&render_project(&1, user))
    }
  end

  def render("get.json", %{project: project, user: user, members: members}) do
    %{
      project: render_project(project, user),
      members: members
    }
  end

  def render("get.json", %{project: project, user: user}) do
    %{
      project: render_project(project, user)
    }
  end
end
