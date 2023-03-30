defmodule TeamstoryWeb.ProjectDataController do
  use TeamstoryWeb, :controller
  require Logger

  alias Teamstory.{Projects}

  action_fallback TeamstoryWeb.FallbackController

  # GET "/projects/:id/data"
  def get_data(conn, %{"id" => project_uuid, "key" => key}) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         data <- Projects.get_project_data(project, key) do
      json(conn, %{data: data && data.value})
    end
  end

  # POST "/projects/:id/data"
  def set_data(conn, %{"id" => project_uuid, "key" => key, "data" => update}) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         data <- Projects.get_project_data(project, key) do
      result =
        if !data do
          Projects.create_project_data(%{
            project_id: project.id,
            key: key,
            value: update
          })
        else
          if data do
            Projects.update_project_data(update, %{value: data})
          else
            Projects.delete_project_data(update)
          end
        end

      with {:ok, _} <- result do
        :ok
      end
    end
  end
end
