configs = Application.get_env(:teamstory, Teamstory.Repo)
repo_url = if configs, do: Keyword.get(configs, :url), else: "pg://localhost/teamstory_dev"

defmodule Teamstory.Repo do
  use Ecto.Repo,
    otp_app: :teamstory,
    adapter: Ecto.Adapters.Postgres

  import Ecto.Changeset

  @doc """
  Dynamically loads the repository url from the
  ECTO_URL environment variable.
  """
  def init(_, opts) do
    override_db = System.get_env("ECTO_URL")
    opts = if override_db != nil, do: Keyword.put(opts, :url, override_db), else: opts
    {:ok, opts}
  end

  def put_change_if_absent(changeset, field, value) do
    if get_field(changeset, field), do: changeset, else: put_change(changeset, field, value)
  end

  def generate_uuid(changeset) do
    if !get_field(changeset, :uuid) do
      put_change(changeset, :uuid, Ecto.UUID.generate())
    else
      changeset
    end
  end

  def truncate(changeset, field, length) do
    update_change(changeset, field, fn str ->
      if is_binary(str) do
        str = String.trim(str)
        Teamstory.Utils.truncate_string(str, length)
      else
        str
      end
    end)
  end

  def upcase(changeset, field) do
    update_change(changeset, field, &String.upcase/1)
  end

  def downcase(changeset, field) do
    update_change(changeset, field, &String.downcase/1)
  end

  def truncate_date(changeset, field) do
    update_change(changeset, field, fn date ->
      if date, do: DateTime.truncate(date, :second), else: date
    end)
  end

  def validate_invalid_chars(changeset, field, invalid_chars, message \\ nil) do
    validate_change(changeset, field, {:invalid_chars, invalid_chars}, fn _, value ->
      has_invalid =
        invalid_chars
        |> String.graphemes()
        |> Enum.find(fn char -> String.contains?(value, char) end)

      if has_invalid,
        do: [{field, {message || "has an invalid character", [validation: :format]}}],
        else: []
    end)
  end

  def time_to_date(changeset, time_field, date_field) do
    put_change(changeset, date_field, changeset |> get_field(time_field) |> DateTime.to_date())
  end

  @spec today(Teamstory.Users.User.t()) :: Date.t() | {:error, any}
  def today(user) do
    Timex.now(user.timezone || Application.get_env(:tandem_otc, :default_tz)) |> Timex.to_date()
  end

  @spec to_month(Date.t()) :: binary
  def to_month(date) do
    String.slice(Date.to_string(date), 0..6)
  end

  # generate base64 encoded code
  def generate_code(length) do
    :crypto.strong_rand_bytes(length) |> Base.url_encode64() |> binary_part(0, length)
  end

  # generate base32 encoded code
  def generate_code_32(length) do
    :crypto.strong_rand_bytes(length) |> Base.encode32() |> binary_part(0, length)
  end

  def strip_utf(changeset, field) do
    update_change(changeset, field, &Strip.strip_utf/1)
  end

  def db_status do
    case Ecto.Adapters.SQL.query(Teamstory.Repo, "SELECT 1") do
      {:ok, _} -> :ok
      _ -> :error
    end
  end

  def mysql_date(date), do: Timex.format!(date, "%F %T", :strftime)
end
