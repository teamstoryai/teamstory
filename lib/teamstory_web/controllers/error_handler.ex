defmodule TeamstoryWeb.ErrorHandler do
  use TeamstoryWeb, :controller
  require Logger

  @doc """
  @param kind - the exception kind (:throw, :error or :exit),
  @param reason the reason (an exception for errors or a term for others)
  @param stack the stacktrace
  """
  def handle_errors(conn, %{kind: _kind, reason: reason, stack: _stack}) do
    conn = put_view(conn, TeamstoryWeb.ErrorView)
    case reason do
      %Phoenix.Router.NoRouteError{} ->
        render conn, "404.json"
      %Phoenix.ActionClauseError{} ->
        render conn, "400.json", message: "Missing params for this request."
      _ ->
        if Teamstory.dev?, do: IO.inspect(reason)
        if Teamstory.test? do
          render conn, "500.json", %{ message: inspect(reason) }
        else
          Logger.warn(inspect(reason))
          render conn, "500.json"
        end
    end
  end

  @spec not_found(Plug.Conn.t(), any) :: Plug.Conn.t()
  def not_found(conn, _) do
    conn
    |> put_status(404)
    |> put_view(TeamstoryWeb.ErrorView)
    |> render(:"404")
  end

end
