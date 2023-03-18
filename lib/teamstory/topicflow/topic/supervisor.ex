defmodule Teamstory.Topicflow.Topic.Supervisor do
  use DynamicSupervisor

  alias Teamstory.Topicflow.Topic

  def start_link(args) do
    DynamicSupervisor.start_link(__MODULE__, args, name: __MODULE__)
  end

  def start_child(id) do
    r =
      DynamicSupervisor.start_child(
        __MODULE__,
        Topic.child_spec(id: id)
      )

    r
  end

  @impl true
  def init(args) do
    DynamicSupervisor.init(
      strategy: :one_for_one,
      extra_arguments: [args]
    )
  end
end
