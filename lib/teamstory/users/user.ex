defmodule Teamstory.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Teamstory.{Users.MagicLink, Repo, Orgs.Organization}

  @type t :: %__MODULE__{}

  def meta(user, key) do
    user.meta && user.meta[key]
  end

  def nickname_or_name(user) do
    if !is_nil(user.nickname) and user.nickname != "", do: user.nickname, else: user.name
  end

  @timestamps_opts [type: :utc_datetime, usec: false]
  schema "users" do
    field :uuid, Ecto.UUID
    field :name, :string
    field :nickname, :string
    field :email, :string
    field :google_id, :string
    field :profile_img, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    field :timezone, :string
    field :invite_id, :integer
    field :meta, :map
    field :activated_at, :utc_datetime
    field :deleted_at, :utc_datetime
    field :origin_type, :string

    has_one :magic_link, MagicLink
    belongs_to :org, Organization

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    attrs =
      Teamstory.Utils.atoms_to_keys(attrs)
      |> cast_google_id

    user
    |> cast(attrs, [
      :uuid,
      :name,
      :nickname,
      :profile_img,
      :email,
      :google_id,
      :password,
      :timezone,
      :activated_at,
      :deleted_at,
      :invite_id,
      :meta,
      :org_id,
      :origin_type
    ])
    |> cast_assoc(:magic_link)
    |> Repo.generate_uuid()
    |> validate_required([:uuid, :name, :email])
    |> validate_length(:email, min: 1, max: 150)
    |> validate_length(:password, min: 5, max: 50)
    |> validate_length(:profile_img, min: 5, max: 255)
    |> Repo.truncate(:timezone, 30)
    |> Repo.truncate(:nickname, 50)
    |> Repo.truncate(:name, 100)
    |> Repo.validate_invalid_chars(:name, "║")
    |> Repo.validate_invalid_chars(:nickname, "║")
    |> Repo.downcase(:email)
    |> unique_constraint(:email)
    |> put_password_hash()
  end

  defp cast_google_id(attrs) do
    if Map.has_key?(attrs, "google_id") do
      %{attrs | "google_id" => to_string(attrs["google_id"])}
    else
      attrs
    end
  end

  defp put_password_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        put_change(changeset, :password_hash, Bcrypt.hash_pwd_salt(pass))
        |> delete_change(:password)

      _ ->
        changeset
    end
  end

  def verified, do: "verified"
end
