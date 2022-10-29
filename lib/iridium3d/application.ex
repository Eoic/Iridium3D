defmodule Iridium3d.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Iridium3d.Repo,
      # Start the Telemetry supervisor
      Iridium3dWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Iridium3d.PubSub},
      # Start the Endpoint (http/https)
      Iridium3dWeb.Endpoint
      # Start a worker by calling: Iridium3d.Worker.start_link(arg)
      # {Iridium3d.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Iridium3d.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    Iridium3dWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
