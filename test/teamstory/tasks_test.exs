defmodule Teamstory.UsersTest do
  use Teamstory.DataCase

  alias Teamstory.Users

  describe "users" do
    alias Teamstory.Users.User

    import Teamstory.UsersFixtures

    @invalid_attrs %{completed_at: nil, deleted_at: nil, description: nil, short_code: nil, state: nil, title: nil}

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Users.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Users.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      valid_attrs = %{creator_id: 1, project_id: 1,
        description: "some description", short_code: "BL-1", state: "some state", title: "some title"}

      assert {:ok, %User{} = user} = Users.create_user(valid_attrs)
      assert user.description == "some description"
      assert user.short_code == "BL-1"
      assert user.state == "some state"
      assert user.title == "some title"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Users.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      update_attrs = %{completed_at: ~U[2022-07-14 06:23:00Z], deleted_at: ~U[2022-07-14 06:23:00Z],
        description: "some updated description", short_code: "BL-2",
        state: "some updated state", title: "some updated title"}

      assert {:ok, %User{} = user} = Users.update_user(user, update_attrs)
      assert user.completed_at == ~U[2022-07-14 06:23:00Z]
      assert user.deleted_at == ~U[2022-07-14 06:23:00Z]
      assert user.description == "some updated description"
      assert user.short_code == "BL-2"
      assert user.state == "some updated state"
      assert user.title == "some updated title"
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
