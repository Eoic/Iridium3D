defmodule Iridium3dWeb.PageController do
  use Iridium3dWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
