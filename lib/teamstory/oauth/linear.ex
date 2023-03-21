defmodule Teamstory.Linear do
  require Logger

  def exchange_code_for_token(code, redirect_uri) do
    [
      client_id: client_id,
      client_secret: client_secret
    ] = configs()

    params = [
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      code: code,
      grant_type: "authorization_code"
    ]

    post("https://api.linear.app/oauth/token", std_headers(), params)
  end

  def add_profile_email(payload) do
    IO.inspect(payload)
    Map.put(payload, "email", nil)
  end

  ###

  def configs, do: Application.get_env(:teamstory, Teamstory.Linear)

  def std_headers(content_type \\ "application/x-www-form-urlencoded") do
    [{"Content-Type", content_type}, {"Accept", "application/json"}]
  end

  def token_header(token, content_type \\ "application/x-www-form-urlencoded") do
    std_headers(content_type) ++ [{"Authorization", "Bearer #{token}"}]
  end

  def oauth_header(id, secret) do
    token = Base.encode64("#{id}:#{secret}")
    std_headers() ++ [{"Authorization", "Basic #{token}"}]
  end

  def post(url, headers, params) do
    body = URI.encode_query(params)

    Mojito.post(url, headers, body)
    |> parse_response()
  end

  def post_json(url, headers, params) do
    body = Jason.encode!(params)

    Mojito.post(url, headers, body)
    |> parse_response()
  end

  def get(url, headers, params \\ %{}) do
    url
    |> URI.parse()
    |> Map.put(:query, URI.encode_query(params))
    |> URI.to_string()
    |> Mojito.get(headers)
    |> parse_response()
  end

  defp parse_response({:ok, %Mojito.Response{status_code: 200, body: body}}) do
    decoded = Poison.decode!(body)
    {:ok, decoded}
  end

  defp parse_response({:ok, %Mojito.Response{status_code: status, body: body}}) do
    # if Teamstory.dev?, do: IO.puts(body)
    case Jason.decode(body) do
      {:ok, decoded} when is_map(decoded) ->
        {:error, :linear, status, decoded["error"]}

      _ ->
        {:error, :linear, status, body}
    end
  end

  defp parse_response({:error, %Mojito.Error{message: message, reason: reason}}) do
    message = message || inspect(reason) |> String.replace("\"", "")
    {:error, :linear, :connection_error, message}
  end
end
