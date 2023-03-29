defmodule Teamstory.Connections do
  @moduledoc """
  The Connections context.
  """

  import Ecto.Query, warn: false
  alias Teamstory.Repo

  alias Teamstory.Connections.{Repository, IssueTracker}

  @spec list_repositories(Project.t()) :: [Repository.t()]
  def list_repositories(project) do
    from(t in Repository,
      where: t.project_id == ^project.id and is_nil(t.deleted_at),
      order_by: [asc: :id]
    )
    |> Repo.all()
  end

  @spec repo_by_uuid(binary) :: {:error, :not_found} | {:ok, Repository.t()}
  def repo_by_uuid(uuid) do
    if uuid != nil and uuid != "undefined" and uuid != "" do
      repo = Repo.one(from q in Repository, where: q.uuid == ^Base.decode16!(String.upcase(uuid)))
      if repo, do: {:ok, repo}, else: {:error, :not_found}
    else
      {:error, :not_found}
    end
  end

  def update_or_create_repository(attrs) do
    existing = Repo.get_by(Repository, project_id: attrs.project_id, base_url: attrs.base_url)

    if existing do
      update_repository(existing, attrs)
    else
      create_repository(attrs)
    end
  end

  @spec list_issue_trackers(Project.t()) :: [IssueTracker.t()]
  def list_issue_trackers(project) do
    from(t in IssueTracker,
      where: t.project_id == ^project.id and is_nil(t.deleted_at),
      order_by: [asc: :id]
    )
    |> Repo.all()
  end

  @spec issue_tracker_by_uuid(binary) :: {:error, :not_found} | {:ok, IssueTracker.t()}
  def issue_tracker_by_uuid(uuid) do
    if uuid != nil and uuid != "undefined" and uuid != "" do
      it = Repo.one(from q in IssueTracker, where: q.uuid == ^Base.decode16!(String.upcase(uuid)))
      if it, do: {:ok, it}, else: {:error, :not_found}
    else
      {:error, :not_found}
    end
  end

  def update_or_create_issue_tracker(attrs) do
    existing = Repo.get_by(IssueTracker, project_id: attrs.project_id, base_url: attrs.base_url)

    if existing do
      update_issue_tracker(existing, attrs)
    else
      create_issue_tracker(attrs)
    end
  end

  @doc """
  Returns the list of repositories.

  ## Examples

      iex> list_repositories()
      [%Repository{}, ...]

  """
  def list_repositories do
    Repo.all(Repository)
  end

  @doc """
  Gets a single repository.

  Raises `Ecto.NoResultsError` if the Repository does not exist.

  ## Examples

      iex> get_repository!(123)
      %Repository{}

      iex> get_repository!(456)
      ** (Ecto.NoResultsError)

  """
  def get_repository!(id), do: Repo.get!(Repository, id)

  @doc """
  Creates a repository.

  ## Examples

      iex> create_repository(%{field: value})
      {:ok, %Repository{}}

      iex> create_repository(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_repository(attrs \\ %{}) do
    %Repository{}
    |> Repository.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a repository.

  ## Examples

      iex> update_repository(repository, %{field: new_value})
      {:ok, %Repository{}}

      iex> update_repository(repository, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_repository(%Repository{} = repository, attrs) do
    repository
    |> Repository.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a repository.

  ## Examples

      iex> delete_repository(repository)
      {:ok, %Repository{}}

      iex> delete_repository(repository)
      {:error, %Ecto.Changeset{}}

  """
  def delete_repository(%Repository{} = repository) do
    Repo.delete(repository)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking repository changes.

  ## Examples

      iex> change_repository(repository)
      %Ecto.Changeset{data: %Repository{}}

  """
  def change_repository(%Repository{} = repository, attrs \\ %{}) do
    Repository.changeset(repository, attrs)
  end

  @doc """
  Returns the list of issue_trackers.

  ## Examples

      iex> list_issue_trackers()
      [%IssueTracker{}, ...]

  """
  def list_issue_trackers do
    Repo.all(IssueTracker)
  end

  @doc """
  Gets a single issue_tracker.

  Raises `Ecto.NoResultsError` if the Issue tracker does not exist.

  ## Examples

      iex> get_issue_tracker!(123)
      %IssueTracker{}

      iex> get_issue_tracker!(456)
      ** (Ecto.NoResultsError)

  """
  def get_issue_tracker!(id), do: Repo.get!(IssueTracker, id)

  @doc """
  Creates a issue_tracker.

  ## Examples

      iex> create_issue_tracker(%{field: value})
      {:ok, %IssueTracker{}}

      iex> create_issue_tracker(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_issue_tracker(attrs \\ %{}) do
    %IssueTracker{}
    |> IssueTracker.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a issue_tracker.

  ## Examples

      iex> update_issue_tracker(issue_tracker, %{field: new_value})
      {:ok, %IssueTracker{}}

      iex> update_issue_tracker(issue_tracker, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_issue_tracker(%IssueTracker{} = issue_tracker, attrs) do
    issue_tracker
    |> IssueTracker.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a issue_tracker.

  ## Examples

      iex> delete_issue_tracker(issue_tracker)
      {:ok, %IssueTracker{}}

      iex> delete_issue_tracker(issue_tracker)
      {:error, %Ecto.Changeset{}}

  """
  def delete_issue_tracker(%IssueTracker{} = issue_tracker) do
    Repo.delete(issue_tracker)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking issue_tracker changes.

  ## Examples

      iex> change_issue_tracker(issue_tracker)
      %Ecto.Changeset{data: %IssueTracker{}}

  """
  def change_issue_tracker(%IssueTracker{} = issue_tracker, attrs \\ %{}) do
    IssueTracker.changeset(issue_tracker, attrs)
  end
end
