defmodule TeamstoryWeb.ValidateRequest do
  require Logger
  import Plug.Conn
  import Phoenix.Controller, only: [put_view: 2, render: 2]

  @behaviour Plug

  alias TeamstoryWeb.ErrorView

  def init(opts), do: opts

  def validate_request(conn) do
    with [request_id] <- get_req_header(conn, "x-req-id"),
         :ok <- valid_req_id(request_id) do
      true
    else
      _ -> false
    end
  end

  def valid_req_id(nil), do: false

  def valid_req_id(req_id) do
    with "api-" <> id <- req_id,
         {id_num, ""} <- Integer.parse(id),
         true <- id_num > 1_680_556_387_027 do
      # todo more advanced validation
      :ok
    end
  end

  def call(conn, _opts) do
    if validate_request(conn) do
      conn
    else
      conn |> put_status(:bad_request) |> put_view(ErrorView) |> render(:"400") |> halt()
    end
  end
end
