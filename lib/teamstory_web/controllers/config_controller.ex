defmodule TeamstoryWeb.ConfigController do
  use TeamstoryWeb, :controller

  action_fallback TeamstoryWeb.FallbackController

  def time(conn, _params) do
    json conn, %{ time: :os.system_time(:millisecond) }
  end

  def githash(conn, _params) do
    json conn, %{ hash: Application.get_env(:teamstory, :githash) }
  end

end
