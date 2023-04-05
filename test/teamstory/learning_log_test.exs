defmodule Teamstory.LearningLogTest do
  use Teamstory.DataCase

  alias Teamstory.LearningLog

  describe "learnings" do
    alias Teamstory.LearningLog.Learning

    import Teamstory.LearningLogFixtures

    @invalid_attrs %{content: nil, end_date: nil, private: nil, start_date: nil, type: nil}

    test "list_learnings/0 returns all learnings" do
      learning = learning_fixture()
      assert LearningLog.list_learnings() == [learning]
    end

    test "get_learning!/1 returns the learning with given id" do
      learning = learning_fixture()
      assert LearningLog.get_learning!(learning.id) == learning
    end

    test "create_learning/1 with valid data creates a learning" do
      valid_attrs = %{
        project_id: 1,
        user_id: 1,
        content: "some content",
        end_date: "some end_date",
        private: true,
        start_date: "some start_date",
        type: "some type"
      }

      assert {:ok, %Learning{} = learning} = LearningLog.create_learning(valid_attrs)
      assert learning.content == "some content"
      assert learning.end_date == "some end_date"
      assert learning.private == true
      assert learning.start_date == "some start_date"
      assert learning.type == "some type"
    end

    test "create_learning/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = LearningLog.create_learning(@invalid_attrs)
    end

    test "update_learning/2 with valid data updates the learning" do
      learning = learning_fixture()

      update_attrs = %{
        content: "some updated content",
        end_date: "some updated end_date",
        private: false,
        start_date: "some updated start_date",
        type: "some updated type"
      }

      assert {:ok, %Learning{} = learning} = LearningLog.update_learning(learning, update_attrs)
      assert learning.content == "some updated content"
      assert learning.end_date == "some updated end_date"
      assert learning.private == false
      assert learning.start_date == "some updated start_date"
      assert learning.type == "some updated type"
    end

    test "update_learning/2 with invalid data returns error changeset" do
      learning = learning_fixture()
      assert {:error, %Ecto.Changeset{}} = LearningLog.update_learning(learning, @invalid_attrs)
      assert learning == LearningLog.get_learning!(learning.id)
    end

    test "delete_learning/1 deletes the learning" do
      learning = learning_fixture()
      assert {:ok, %Learning{}} = LearningLog.delete_learning(learning)
      assert_raise Ecto.NoResultsError, fn -> LearningLog.get_learning!(learning.id) end
    end

    test "change_learning/1 returns a learning changeset" do
      learning = learning_fixture()
      assert %Ecto.Changeset{} = LearningLog.change_learning(learning)
    end
  end
end
