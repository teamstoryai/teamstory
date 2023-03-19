defmodule TeamstoryWeb.BillingController do
  use TeamstoryWeb, :controller
  require Logger

  action_fallback TeamstoryWeb.FallbackController

  alias Teamstory.{Orgs, Billing}

  # GET /billing/info
  # get basic billing info
  def info(conn, _) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         org when is_map(org) <- Orgs.get_organization(user.org_id),
         sub <- Billing.get_subscription(org) do
      twoWeeksAfterCreation = Timex.shift(org.inserted_at, weeks: 2)
      deadline = twoWeeksAfterCreation
      next_days = Timex.diff(deadline, Timex.now(), :days)

      json(conn, %{
        valid: Billing.valid_sub?(sub),
        next_days: next_days,
        plan: sub != nil && sub.type
      })
    end
  end

  # POST /billing/new
  # initiate subscription
  def new(conn, %{"plan" => plan, "period" => period}) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         org when is_map(org) <- Orgs.get_organization(user.org_id) do
      price_codes = Application.get_env(:teamstory, :stripe_products)
      prices = price_codes[plan]
      price_id = elem(prices, if(period == "annual", do: 1, else: 0))

      session_config = %{
        cancel_url: Teamstory.base_url() <> "/auth/subscription?cancel=true",
        success_url: Teamstory.base_url() <> "/auth/subscription?success=true",
        mode: "subscription",
        customer_email: user.email,
        allow_promotion_codes: true,
        billing_address_collection: "required",
        metadata: %{
          "org" => org.uuid
        },
        line_items: [
          %{
            price: price_id,
            quantity: 1
          }
        ]
      }

      case Stripe.Session.create(session_config) do
        {:ok, session} ->
          json(conn, %{url: session.url})

        {:error, stripe_error} ->
          IO.inspect(stripe_error)
          {:error, :bad_request, stripe_error.message}
      end
    end
  end

  # POST /billing/manage
  # manage subscription
  def manage(conn, _) do
    with user when is_map(user) <- Guardian.Plug.current_resource(conn),
         org when is_map(org) <- Orgs.get_organization(user.org_id),
         sub <- Billing.get_subscription(org) do
      customer = if sub, do: sub.customer_id

      session_config = %{
        customer: customer,
        return_url: Teamstory.base_url() <> "/auth/subscription"
      }

      case Stripe.BillingPortal.Session.create(session_config) do
        {:ok, session} ->
          json(conn, %{url: session.url})

        {:error, stripe_error} ->
          IO.inspect(stripe_error)
          {:error, :bad_request, stripe_error.message}
      end
    end
  end
end
