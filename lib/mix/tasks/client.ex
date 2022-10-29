defmodule Mix.Tasks.Client do
  use Mix.Task
  require Logger

  defmodule Build do
    @public_path ".\\priv\\static\\webapp\\"

    def run(_) do
      Logger.info("Installing NPM packages.")
      System.cmd("cmd.exe", ["/c", "npm install"], cd: ".\\frontend", into: IO.stream(:stdio, :line))

      Logger.info("Compiling React front-end.")
      System.cmd("cmd.exe", ["/c", "npm run build"], cd: ".\\frontend", into: IO.stream(:stdio, :line))

      Logger.info("Moving dist folder to Phoenix at #{@public_path}.")
      System.cmd("cmd.exe", ["/c", "rd /s /q", @public_path], into: IO.stream(:stdio, :line))
      System.cmd("cmd.exe", ["/c", "xcopy /s /e /y", ".\\frontend\\dist", @public_path], into: IO.stream(:stdio, :line))

      Logger.info("Front-end ready.")
    end
  end

  defmodule Dev do
    def run(_) do
      System.cmd("cmd.exe", ["/c", "npm run dev"], cd: ".\\frontend", into: IO.stream(:stdio, :line))
    end
  end

  def run(_), do: IO.puts("Running...")
end
