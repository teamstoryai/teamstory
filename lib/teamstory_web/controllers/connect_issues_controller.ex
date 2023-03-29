defmodule TeamstoryWeb.ConnectIssuesController do
  use TeamstoryWeb, :controller

  require Logger

  action_fallback TeamstoryWeb.FallbackController

  alias Teamstory.{Connections, Projects, Utils}

  # GET /connect/issues
  def index(conn, %{"project_id" => project_uuid}) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         items <- Connections.list_issue_trackers(project) do
      render(conn, "list.json", items: items)
    end
  end

  # POST /connect/issues
  def create(conn, %{"project_id" => project_uuid} = params) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         attrs <- %{
           name: params["name"],
           base_url: params["base_url"],
           service: params["service"],
           project_id: project.id,
           deleted_at: nil
         },
         {:ok, item} <- Connections.update_or_create_issue_tracker(attrs) do
      render(conn, "get.json", item: item)
    end
  end

  # PUT /connect/issues/id
  def update(conn, %{"id" => uuid} = params) do
    attrs = Utils.params_to_attrs(params, ["deleted_at"])

    with user <- Guardian.Plug.current_resource(conn),
         {:ok, item} <- Connections.issue_tracker_by_uuid(uuid),
         true <- Projects.is_member?(item.project_id, user),
         {:ok, item} <- Connections.update_issue_tracker(item, attrs) do
      render(conn, "get.json", item: item)
    end
  end
end
