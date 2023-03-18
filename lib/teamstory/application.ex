defmodule Teamstory.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false


  use Application

  @impl true
  def start(_type, _args) do
    topologies = [
      teamstory: Application.get_env(:teamstory, :cluster_topology)
    ]

    :hackney_pool.set_max_connections(:default, 1000)

    topic_modules = [
      {"contacts:", Teamstory.Topics.ContactsTopic, %{}},
      {"rooms:", Teamstory.Topics.RoomsTopic, %{}},
      {"user_settings:", Teamstory.Topics.UserSettingsTopic, %{}},
      {"pong:", Teamstory.Topicflow.Examples.PongTopic, %{}},
      {"test:", Teamstory.Topicflow.Test.TestTopic, %{}},
      {"test_foobar:", Teamstory.Topicflow.Test.PersistentTopic, %{}},
      {"rtc:", nil, %{ verify_ignore_presence_keys: ["stats", "context"] }},
      {"cursor:", nil, %{ verify_ignore_presence_keys: ["cursor"] }},
    ]

    # Define workers and child supervisors to be supervised
    children = [
      # cluster supervisor
      {Cluster.Supervisor, [topologies, [name: Teamstory.ClusterSupervisor]]},

      # redis global instance
      {Redix, {Application.get_env(:teamstory, :redis), [name: :redix]}},

      # Start the Ecto repository
      Teamstory.Repo,
      Teamstory.Vault,

      # Start the Telemetry supervisor
      TeamstoryWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Teamstory.PubSub},
      # Start the Endpoint (http/https)
      TeamstoryWeb.Endpoint,

      # Start your own worker by calling: Teamstory.Worker.start_link(arg1, arg2, arg3)
      %{ id: Teamstory.Cache, start: { Teamstory.Cache, :start_link, [] } },
      %{ id: Teamstory.Config, start: { Teamstory.Config, :start_link, [] } },
      LogDNA.BatchLogger,

      (Teamstory.test?() || Teamstory.server?()) && {Teamstory.Topicflow.Supervisor, [topic_modules: topic_modules]},

    ] |> Enum.reject(&(&1 == nil or &1 == false))

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Teamstory.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TeamstoryWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  def asset_cache_bust do
    Phoenix.Config.clear_cache TeamstoryWeb.Endpoint
    Phoenix.Endpoint.Supervisor.warmup TeamstoryWeb.Endpoint
  end
end
