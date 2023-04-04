defmodule TeamstoryWeb.LearningsController do
  use TeamstoryWeb, :controller

  require Logger

  action_fallback TeamstoryWeb.FallbackController

  alias Teamstory.{LearningLog, Projects, Utils}

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
      render(conn, "list.json", items: items)
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
        type: type,
        private: private,
        start_date: start_date,
        end_date: end_date,
        content: content
      }

      result =
        if existing do
          LearningLog.update_log(existing, attrs)
        else
          LearningLog.create_log(project, user, attrs)
        end

      with {:ok, _item} <- result do
        :ok
      end
    end
  end
end
