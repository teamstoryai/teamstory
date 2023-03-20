defmodule Teamstory.ConnectionsTest do
  use Teamstory.DataCase

  alias Teamstory.Connections

  describe "repositories" do
    alias Teamstory.Connections.Repository

    import Teamstory.ConnectionsFixtures

    @invalid_attrs %{avatar_url: nil, base_url: nil, deleted_at: nil, name: nil, service: nil}

    test "list_repositories/0 returns all repositories" do
      repository = repository_fixture()
      assert Connections.list_repositories() == [repository]
    end

    test "get_repository!/1 returns the repository with given id" do
      repository = repository_fixture()
      assert Connections.get_repository!(repository.id) == repository
    end

    test "create_repository/1 with valid data creates a repository" do
      valid_attrs = %{avatar_url: "some avatar_url", base_url: "some base_url", deleted_at: ~U[2023-03-19 21:30:00Z], name: "some name", service: "some service"}

      assert {:ok, %Repository{} = repository} = Connections.create_repository(valid_attrs)
      assert repository.avatar_url == "some avatar_url"
      assert repository.base_url == "some base_url"
      assert repository.deleted_at == ~U[2023-03-19 21:30:00Z]
      assert repository.name == "some name"
      assert repository.service == "some service"
    end

    test "create_repository/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Connections.create_repository(@invalid_attrs)
    end

    test "update_repository/2 with valid data updates the repository" do
      repository = repository_fixture()
      update_attrs = %{avatar_url: "some updated avatar_url", base_url: "some updated base_url", deleted_at: ~U[2023-03-20 21:30:00Z], name: "some updated name", service: "some updated service"}

      assert {:ok, %Repository{} = repository} = Connections.update_repository(repository, update_attrs)
      assert repository.avatar_url == "some updated avatar_url"
      assert repository.base_url == "some updated base_url"
      assert repository.deleted_at == ~U[2023-03-20 21:30:00Z]
      assert repository.name == "some updated name"
      assert repository.service == "some updated service"
    end

    test "update_repository/2 with invalid data returns error changeset" do
      repository = repository_fixture()
      assert {:error, %Ecto.Changeset{}} = Connections.update_repository(repository, @invalid_attrs)
      assert repository == Connections.get_repository!(repository.id)
    end

    test "delete_repository/1 deletes the repository" do
      repository = repository_fixture()
      assert {:ok, %Repository{}} = Connections.delete_repository(repository)
      assert_raise Ecto.NoResultsError, fn -> Connections.get_repository!(repository.id) end
    end

    test "change_repository/1 returns a repository changeset" do
      repository = repository_fixture()
      assert %Ecto.Changeset{} = Connections.change_repository(repository)
    end
  end

  describe "issue_trackers" do
    alias Teamstory.Connections.IssueTracker

    import Teamstory.ConnectionsFixtures

    @invalid_attrs %{deleted_at: nil, project: nil, project_id: nil, service: nil, uuid: nil}

    test "list_issue_trackers/0 returns all issue_trackers" do
      issue_tracker = issue_tracker_fixture()
      assert Connections.list_issue_trackers() == [issue_tracker]
    end

    test "get_issue_tracker!/1 returns the issue_tracker with given id" do
      issue_tracker = issue_tracker_fixture()
      assert Connections.get_issue_tracker!(issue_tracker.id) == issue_tracker
    end

    test "create_issue_tracker/1 with valid data creates a issue_tracker" do
      valid_attrs = %{deleted_at: ~U[2023-03-19 21:42:00Z], project: "some project", project_id: "some project_id", service: "some service", uuid: "7488a646-e31f-11e4-aace-600308960662"}

      assert {:ok, %IssueTracker{} = issue_tracker} = Connections.create_issue_tracker(valid_attrs)
      assert issue_tracker.deleted_at == ~U[2023-03-19 21:42:00Z]
      assert issue_tracker.project == "some project"
      assert issue_tracker.project_id == "some project_id"
      assert issue_tracker.service == "some service"
      assert issue_tracker.uuid == "7488a646-e31f-11e4-aace-600308960662"
    end

    test "create_issue_tracker/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Connections.create_issue_tracker(@invalid_attrs)
    end

    test "update_issue_tracker/2 with valid data updates the issue_tracker" do
      issue_tracker = issue_tracker_fixture()
      update_attrs = %{deleted_at: ~U[2023-03-20 21:42:00Z], project: "some updated project", project_id: "some updated project_id", service: "some updated service", uuid: "7488a646-e31f-11e4-aace-600308960668"}

      assert {:ok, %IssueTracker{} = issue_tracker} = Connections.update_issue_tracker(issue_tracker, update_attrs)
      assert issue_tracker.deleted_at == ~U[2023-03-20 21:42:00Z]
      assert issue_tracker.project == "some updated project"
      assert issue_tracker.project_id == "some updated project_id"
      assert issue_tracker.service == "some updated service"
      assert issue_tracker.uuid == "7488a646-e31f-11e4-aace-600308960668"
    end

    test "update_issue_tracker/2 with invalid data returns error changeset" do
      issue_tracker = issue_tracker_fixture()
      assert {:error, %Ecto.Changeset{}} = Connections.update_issue_tracker(issue_tracker, @invalid_attrs)
      assert issue_tracker == Connections.get_issue_tracker!(issue_tracker.id)
    end

    test "delete_issue_tracker/1 deletes the issue_tracker" do
      issue_tracker = issue_tracker_fixture()
      assert {:ok, %IssueTracker{}} = Connections.delete_issue_tracker(issue_tracker)
      assert_raise Ecto.NoResultsError, fn -> Connections.get_issue_tracker!(issue_tracker.id) end
    end

    test "change_issue_tracker/1 returns a issue_tracker changeset" do
      issue_tracker = issue_tracker_fixture()
      assert %Ecto.Changeset{} = Connections.change_issue_tracker(issue_tracker)
    end
  end
end
