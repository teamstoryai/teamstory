# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :teamstory,
  ecto_repos: [Teamstory.Repo]

# Configures the endpoint
config :teamstory, TeamstoryWeb.Endpoint,
  url: [host: "localhost"],
  version: Mix.Project.config()[:version],
  render_errors: [view: TeamstoryWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Teamstory.PubSub,
  live_view: [signing_salt: "MkW9CMZy"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :teamstory, Teamstory.Mailer, adapter: Swoosh.Adapters.Local

# Swoosh API client is needed for adapters other than SMTP.
config :swoosh, :api_client, false

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.14.29",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :phoenix, :filter_parameters, ["password", "secret", "contents", "bindata", "notes"]

##############################
# Server configuration

# Configure Teamstory.Application's clustering topology
config :teamstory, :cluster_topology,
  strategy: Cluster.Strategy.Epmd,
  config: [hosts: []]

{githash, _} = System.cmd("git", ["rev-parse", "HEAD"])
config :teamstory, githash: String.trim(githash)

config :teamstory, env: Mix.env()
config :teamstory, prod: Mix.env() == :prod
config :teamstory, dev: Mix.env() == :dev
config :teamstory, test: Mix.env() == :test
config :teamstory, staging: System.get_env("STAGING")

config :teamstory, staging: System.get_env("STAGING")

config :teamstory, static_asset_path: "priv/static"
config :teamstory, load_application_links_from_s3: false

config :teamstory, sendgrid_api_key: System.get_env("SENDGRID_KEY")

config :teamstory, openai_api_key: System.get_env("OPENAI_KEY")

config :teamstory, Teamstory.Github,
  client_id: System.get_env("GH_APP_CLIENT_ID"),
  client_secret: System.get_env("GH_APP_CLIENT_SECRET")

config :teamstory, Teamstory.Linear,
  client_id: System.get_env("LINEAR_CLIENT_ID"),
  client_secret: System.get_env("LINEAR_CLIENT_SECRET")

config :ex_aws,
  access_key_id: {:system, "LN_S3_ACCESS_KEY_ID"},
  secret_access_key: {:system, "LN_S3_SECRET_ACCESS_KEY"},
  s3: [
    host: "us-southeast-1.linodeobjects.com"
  ]

config :arc,
  storage: Arc.Storage.S3,
  bucket: "listnote-uploads",
  asset_host: "us-southeast-1.linodeobjects.com",
  virtual_host: true

config :teamstory, Teamstory.Auth.Guardian,
  issuer: "teamstory",
  secret_key: "hNl6o6PmZIvYBP2dx3nDixwG4xA+MquH+MR4u5xBGXBwROzCPNeAOddVssKb7A0i",
  token_ttl: %{"access" => {3, :day}, "refresh" => {12, :week}}

config :teamstory, Teamstory.Auth.OAuth,
  google_client_id: System.get_env("TS_GOOGLE_ID"),
  google_client_secret: System.get_env("TS_GOOGLE_SECRET")

redis_url = System.get_env("REDIS_URL") || "redis://127.0.0.1:6379/0"

config :teamstory, redis: redis_url

config :teamstory, local_timezone: "America/Los_Angeles"

config :mojito,
  timeout: 10_000,
  pool_opts: [size: 100, max_overflow: 500]

config :hammer,
  backend: {Hammer.Backend.ETS, [expiry_ms: 60_000 * 60 * 4, cleanup_interval_ms: 60_000 * 10]}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
