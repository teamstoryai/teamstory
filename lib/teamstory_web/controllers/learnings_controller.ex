defmodule TeamstoryWeb.LearningsController do
  use TeamstoryWeb, :controller

  require Logger

  action_fallback TeamstoryWeb.FallbackController

  alias Teamstory.{LearningLog, Projects}

  # GET /learnings
  def index(conn, %{
        "project_id" => project_uuid,
        "type" => type,
        "start_date" => start_date,
        "end_date" => end_date
      }) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         items <- LearningLog.all_logs_for_period(project, user, type, start_date, end_date) do
      render(conn, "list.json", user: user, items: items)
    end
  end

  # POST /learnings
  def create(conn, %{
        "project_id" => project_uuid,
        "type" => type,
        "content" => content,
        "start_date" => start_date,
        "end_date" => end_date,
        "private" => private
      }) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         {:ok, project} <- Projects.project_by_uuid(user.id, project_uuid),
         items <- LearningLog.user_logs_for_period(project, user, type, start_date, end_date) do
      existing =
        Enum.find(items, fn item ->
          private == item.private
        end)

      attrs = %{
        project_id: project.id,
        user_id: user.id,
        type: type,
        private: private,
        start_date: start_date,
        end_date: end_date,
        content: content
      }

      result =
        cond do
          existing && content == "" ->
            LearningLog.delete_learning(existing)

          existing ->
            LearningLog.update_learning(existing, attrs)

          true ->
            LearningLog.create_learning(attrs)
        end

      with {:ok, item} <- result do
        item = %{item | user: user}
        render(conn, "get.json", user: user, item: item)
      end
    end
  end
end
