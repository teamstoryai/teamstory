defmodule Teamstory.OAuthTokensTest do
  use Teamstory.DataCase

  alias Teamstory.OAuthTokens

  describe "oauth_tokens" do
    alias Teamstory.OAuthTokens.OAuthToken

    import Teamstory.OAuthTokensFixtures

    @invalid_attrs %{
      access: nil,
      deleted_at: nil,
      expires_at: nil,
      meta: nil,
      name: nil,
      refresh: nil
    }

    test "create and retrieve project tokens" do
      oauth_token = oauth_token_fixture(%{project_id: 1, name: "foobs"})
      assert oauth_token.project_id == 1

      tokens = OAuthTokens.multiple_for_project(%{id: 1}, [oauth_token.name])
      assert tokens == [oauth_token]
    end

    test "list_oauth_tokens/0 returns all oauth_tokens" do
      oauth_token = oauth_token_fixture()
      assert OAuthTokens.list_oauth_tokens() == [oauth_token]
    end

    test "get_oauth_token!/1 returns the oauth_token with given id" do
      oauth_token = oauth_token_fixture()
      assert OAuthTokens.get_oauth_token!(oauth_token.id) == oauth_token
    end

    test "create_oauth_token/1 with valid data creates a oauth_token" do
      valid_attrs = %{
        access: "some access",
        user_id: 1,
        expires_at: ~U[2022-10-19 23:40:00Z],
        meta: %{},
        name: "some name",
        refresh: "some refresh"
      }

      assert {:ok, %OAuthToken{} = oauth_token} = OAuthTokens.create_oauth_token(valid_attrs)
      assert oauth_token.access == "some access"
      assert oauth_token.expires_at == ~U[2022-10-19 23:40:00Z]
      assert oauth_token.meta == %{}
      assert oauth_token.name == "some name"
      assert oauth_token.refresh == "some refresh"
    end

    test "create_oauth_token/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = OAuthTokens.create_oauth_token(@invalid_attrs)
    end

    test "update_oauth_token/2 with valid data updates the oauth_token" do
      oauth_token = oauth_token_fixture()

      update_attrs = %{
        access: "some updated access",
        deleted_at: ~U[2022-10-20 23:40:00Z],
        expires_at: ~U[2022-10-20 23:40:00Z],
        meta: %{},
        name: "some updated name",
        refresh: "some updated refresh"
      }

      assert {:ok, %OAuthToken{} = oauth_token} =
               OAuthTokens.update_oauth_token(oauth_token, update_attrs)

      assert oauth_token.access == "some updated access"
      assert oauth_token.deleted_at == ~U[2022-10-20 23:40:00Z]
      assert oauth_token.expires_at == ~U[2022-10-20 23:40:00Z]
      assert oauth_token.meta == %{}
      assert oauth_token.name == "some updated name"
      assert oauth_token.refresh == "some updated refresh"
    end

    test "update_oauth_token/2 with invalid data returns error changeset" do
      oauth_token = oauth_token_fixture()

      assert {:error, %Ecto.Changeset{}} =
               OAuthTokens.update_oauth_token(oauth_token, @invalid_attrs)

      assert oauth_token == OAuthTokens.get_oauth_token!(oauth_token.id)
    end

    test "delete_oauth_token/1 deletes the oauth_token" do
      oauth_token = oauth_token_fixture()
      assert {:ok, %OAuthToken{}} = OAuthTokens.delete_oauth_token(oauth_token)
      assert_raise Ecto.NoResultsError, fn -> OAuthTokens.get_oauth_token!(oauth_token.id) end
    end

    test "change_oauth_token/1 returns a oauth_token changeset" do
      oauth_token = oauth_token_fixture()
      assert %Ecto.Changeset{} = OAuthTokens.change_oauth_token(oauth_token)
    end
  end
end
