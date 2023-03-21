defmodule TeamstoryWeb.ConfigController do
  use TeamstoryWeb, :controller

  action_fallback TeamstoryWeb.FallbackController

  def time(conn, _params) do
    json(conn, %{time: :os.system_time(:millisecond)})
  end

  def githash(conn, _params) do
    json(conn, %{hash: Application.get_env(:teamstory, :githash)})
  end

  def client_id(conn, %{"service" => service}) do
    [{:client_id, id} | _rest] =
      case service do
        "github" ->
          Application.get_env(:teamstory, Teamstory.Github)

        "linear" ->
          Application.get_env(:teamstory, Teamstory.Linear)

        _ ->
          [client_id: "invalid"]
      end

    json(conn, %{client_id: id})
  end
end
