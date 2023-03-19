defmodule Teamstory.UsersTest do
  use Teamstory.DataCase

  alias Teamstory.Users

  describe "users" do
    alias Teamstory.Users.User

    import Teamstory.UsersFixtures

    @invalid_attrs %{
      name: nil,
      email: nil
    }

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Enum.find(Users.list_users(), fn u -> u.id == user.id end)
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Users.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      valid_attrs = %{name: "George", email: "foo@bar.com"}

      assert {:ok, %User{} = user} = Users.create_user(valid_attrs)
      assert user.name == "George"
      assert user.email == "foo@bar.com"
      assert user.uuid
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Users.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      update_attrs = %{name: "Richard"}

      assert {:ok, %User{} = user} = Users.update_user(user, update_attrs)
      assert user.name == "Richard"
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Users.update_user(user, @invalid_attrs)
      assert user == Users.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Users.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Users.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Users.change_user(user)
    end
  end
end
