defmodule TeamstoryWeb.PageControllerTest do
  use TeamstoryWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "Daybird"
  end
end
