defmodule TeamstoryWeb.ConnectReposController do
  use TeamstoryWeb, :controller

  require Logger

  action_fallback TeamstoryWeb.FallbackController

  alias Teamstory.{Connections, Github, OAuthTokens, Projects, Utils}

  # GET /connect/repos/fetch_orgs (project in gitlab)
  def fetch_orgs(conn, %{"service" => service}) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, token} <- get_token(user, service) do
      result =
        case service do
          "github" ->
            {:ok, orgs} = Github.orgs(token.access)
            {:ok, user} = Github.user(token.access)
            user = Map.put(user, "type", "user")
            {:ok, orgs ++ [user]}
        end

      return_result_or_error(conn, result)
    end
  end

  # GET /connect/repos/fetch_repos
  def fetch_repos(conn, %{"service" => service, "org" => org}) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, token} <- get_token(user, service) do
      result =
        case service do
          "github" ->
            if org == "<user>" do
              Github.user_repos(token.access)
            else
              Github.org_repos(token.access, org)
            end
        end

      return_result_or_error(conn, result)
    end
  end

  defp return_result_or_error(conn, result) do
    with {:ok, data} <- result do
      json(conn, data)
    else
      {:error, _source, reason, _message} ->
        {:error, :bad_request, reason}
    end
  end

  defp get_token(user, service) do
    token = hd(OAuthTokens.all_for_user(user, service))
    if token, do: {:ok, token}, else: {:error, :not_found}
  end

  # GET /connect/repos
  def index(conn, %{"project_id" => project_uuid}) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         repos <- Connections.list_repositories(project) do
      render(conn, "list.json", items: repos)
    end
  end

  # POST /connect/repos
  def create(conn, %{"project_id" => project_uuid} = params) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         attrs <- %{
           name: params["name"],
           avatar_url: params["name"],
           base_url: params["base_url"],
           service: params["service"],
           project_id: project.id
         },
         {:ok, repo} <- Connections.create_repository(attrs) do
      render(conn, "get.json", item: repo)
    end
  end

  # PUT /connect/repos/id
  def update(conn, %{"id" => uuid} = params) do
    attrs = Utils.params_to_attrs(params, ["deleted_at"])

    with user <- Guardian.Plug.current_resource(conn),
         {:ok, repo} <- Connections.repo_by_uuid(uuid),
         true <- Projects.is_member?(repo.project_id, user),
         {:ok, repo} <- Connections.update_repository(repo, attrs) do
      render(conn, "get.json", item: repo)
    end
  end
end
