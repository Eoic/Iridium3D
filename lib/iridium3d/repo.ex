defmodule Iridium3d.Repo do
  use Ecto.Repo,
    otp_app: :iridium3d,
    adapter: Ecto.Adapters.Postgres
end
