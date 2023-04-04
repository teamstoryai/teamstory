defmodule TeamstoryWeb.AIController do
  use TeamstoryWeb, :controller

  require Logger

  action_fallback TeamstoryWeb.FallbackController

  # POST /ai/*
  def complete(
        conn,
        %{"project_id" => project_uuid, "verb" => _verb, "messages" => messages} = params
      ) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn) do
      prompt_joined = Enum.join(messages, "\n")
      prompt_hash = :crypto.hash(:md5, prompt_joined) |> Base.encode16()
      cache_key = "complete:" <> project_uuid <> ":" <> prompt_hash

      case Redix.command(:redix, ["GET", cache_key]) do
        {:ok, nil} ->
          with {:ok, result, finished} <- get_completion(user, messages, params) do
            to_cache =
              if finished do
                "F" <> result
              else
                "P" <> result
              end

            Redix.command(:redix, ["SET", cache_key, to_cache, "EX", "86400"])

            if !finished do
              put_status(conn, 206)
              |> text(result)
            else
              text(conn, result)
            end
          end

        {:ok, data} ->
          case data do
            "F" <> result ->
              text(conn, result)

            "P" <> result ->
              put_status(conn, 206)
              |> text(result)
          end
      end
    end
  end

  def get_completion(user, messages, params) do
    case Hammer.check_rate("openai:#{user.id}", 60_000, 5) do
      {:allow, _count} ->
        IO.inspect(messages)
        model = params["model"] || "gpt-3.5-turbo"
        tokens = params["tokens"] || 160

        with {:ok, response} <- Teamstory.OpenAI.chat(user.id, messages, model, tokens) do
          IO.inspect(response)
          choice = hd(response["choices"])
          result = choice["message"]["content"] |> String.trim()
          finished = choice["finish_reason"] != "length"

          {:ok, result, finished}
        else
          {:error, :openai, _status, body} ->
            IO.inspect(body)
            {:error, :bad_request, "Unable to complete request"}
        end

      {:deny, _limit} ->
        {:error, :too_many_requests, "Too many requests"}
    end
  end
end
