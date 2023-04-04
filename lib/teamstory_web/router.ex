defmodule TeamstoryWeb.Router do
  use TeamstoryWeb, :router
  use Plug.ErrorHandler

  import Plug.BasicAuth
  import Phoenix.LiveDashboard.Router

  pipeline :browser do
    plug :accepts, ["html"]

    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers

    # Serve at "/" the static files from "priv/static" directory.
    plug(
      Plug.Static,
      at: "/",
      from: :teamstory,
      gzip: true,
      only: ~w(assets js css sounds favicon.ico robots.txt version.json pwa.json
        pwa-local.json pwa-insight.json pwa-addie.json serviceworker.js)
    )
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :user_or_guest do
    plug Teamstory.Auth.Pipeline
    plug Guardian.Plug.EnsureAuthenticated, claims: %{"typ" => "access"}
  end

  pipeline :authenticated do
    plug Teamstory.Auth.Pipeline
    plug Guardian.Plug.EnsureAuthenticated
    plug TeamstoryWeb.ValidateRequest
  end

  pipeline :logging do
    plug TeamstoryWeb.RequestLogger
  end

  pipeline :validate_csrf do
    plug :fetch_session
    plug :protect_from_forgery
  end

  pipeline :testing do
    plug :accepts, ["html"]
    plug TeamstoryWeb.AssertNotProd
  end

  pipeline :dashboard do
    plug :basic_auth, username: "admin", password: "all good boys go to heaven"
  end

  # API scope
  scope "/api/v1", TeamstoryWeb do
    pipe_through :api
    pipe_through :logging

    post "/sign_in", AuthController, :sign_in
    post "/log_in_else_sign_up_oauth", AuthController, :log_in_else_sign_up_oauth
    post "/create_account", AuthController, :create_account
    post "/sign_in_oauth", AuthController, :sign_in_oauth
    post "/forgot_password", AuthController, :forgot_password
    post "/reset_password", AuthController, :reset_password
    post "/exchange_token", AuthController, :exchange_token

    get "/time", ConfigController, :time
    get "/githash", ConfigController, :githash
    get "/client_id", ConfigController, :client_id

    pipe_through :authenticated

    get "/user", AuthController, :fetch_user
    put "/user", AuthController, :update_user
    post "/join_invite", AuthController, :join_invite
    post "/verify_email", AuthController, :verify_email
    post "/login_success", AuthController, :login_success

    post "/oauth/connect", OAuthController, :connect_service
    post "/oauth/exchange", OAuthController, :exchange_token
    get "/oauth/token", OAuthController, :get_service_token
    put "/oauth/token", OAuthController, :update_service_token
    delete "/oauth/token", OAuthController, :delete_service_token
    post "/oauth/refresh", OAuthController, :refresh_service_token

    resources "/projects", ProjectsController
    post "/projects/:id/add_member", ProjectsController, :add_member
    post "/projects/:id/remove_member", ProjectsController, :remove_member
    get "/projects/:id/data", ProjectDataController, :get_data
    post "/projects/:id/data", ProjectDataController, :set_data

    get "/users/data", UserDataController, :get_user_data
    post "/users/data", UserDataController, :set_user_data

    resources "/connect/repos", ConnectReposController, only: [:index, :create, :update]
    get "/connect/repos/fetch_orgs", ConnectReposController, :fetch_orgs
    get "/connect/repos/fetch_repos", ConnectReposController, :fetch_repos
    resources "/connect/issues", ConnectIssuesController, only: [:index, :create, :update]

    get "/subinfo", BillingController, :info
    get "/billing/info", BillingController, :info
    post "/billing/new", BillingController, :new
    post "/billing/manage", BillingController, :manage

    post "/ai/:verb", AIController, :complete
  end

  # Web scope (skipping logging)
  scope "/", TeamstoryWeb do
    pipe_through :browser

    get "/health", PageController, :health

    pipe_through :testing

    get "/topics", TopicsController, :index
    get "/topics/:topic", TopicsController, :show
  end

  scope "/api/v1", TeamstoryWeb do
    pipe_through :logging
    pipe_through :api

    get "/*path", ErrorHandler, :not_found
    post "/*path", ErrorHandler, :not_found
    put "/*path", ErrorHandler, :not_found
    delete "/*path", ErrorHandler, :not_found
  end

  scope "/" do
    pipe_through [:browser, :dashboard]
    live_dashboard "/dashboard", metrics: TeamstoryWeb.Telemetry
  end

  # Web scope
  scope "/", TeamstoryWeb do
    pipe_through :browser
    pipe_through :logging

    get "/app/*path", PageController, :app
    get "/insight/*path", PageController, :insight

    get "/addie", PageController, :addie

    get "/signup", PageController, :auth
    get "/signin", PageController, :auth
    get "/auth/*path", PageController, :auth

    get "/admin/*path", PageController, :admin

    get "/oauth/:service", OAuthController, :connect_oauth

    get "/about", PageController, :redirect_about
    get "/faq", PageController, :redirect_faq
    get "/blog", PageController, :redirect_blog

    get "/maintenance", PageController, :maintenance

    # landing page
    get "/*path", PageController, :index
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  def handle_errors(conn, data) do
    TeamstoryWeb.ErrorHandler.handle_errors(conn, data)
  end
end
