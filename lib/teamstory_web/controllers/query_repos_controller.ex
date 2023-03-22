defmodule TeamstoryWeb.QueryReposController do
  use TeamstoryWeb, :controller

  require Logger

  action_fallback TeamstoryWeb.FallbackController

  alias Teamstory.{Connections, Github, OAuthTokens, Projects}

  @services ["github", "gitlab"]

  # GET /query/repos/:query
  def query(conn, %{"project" => project_id, "query" => "pulls"} = params) do
    with {:ok, tokens, repos} <- tokens_repos_helper(conn, project_id) do
      tasks =
        Enum.map(repos, fn repo ->
          case repo.service do
            "github" ->
              Task.async(fn ->
                token = tokens["github"]

                with {:ok, result} <- Github.pulls(token.access, repo.name, params) do
                  result
                else
                  {:error, _source, reason, message} ->
                    Logger.error("Error fetching pulls for #{repo.name}: #{reason} #{message}")
                    []
                end
              end)
          end
        end)

      result = Task.await_many(tasks, 10000)
      json(conn, result)
    end
  end

  def tokens_repos_helper(conn, project_uuid) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, tokens} <- OAuthTokens.multiple_for_user(user, @services),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         repos <- Connections.list_repositories(project) do
      tokens = Enum.map(tokens, fn token -> {token.service, token} end) |> Map.new()
      {:ok, tokens, repos}
    end
  end
end
