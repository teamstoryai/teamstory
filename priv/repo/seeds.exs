# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Teamstory.Repo.insert!(%Teamstory.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

user = Teamstory.Repo.insert!(%Teamstory.Users.User{
  name: "Bob Cat",
  email: "bob@cat.com"
})

project = Teamstory.Repo.insert!(%Teamstory.Projects.Project{
  creator_id: user.id,
  uuid: Ecto.UUID.generate,
  name: "Work Stuff",
  shortcode: "WS"
})

Teamstory.Repo.insert!(%Teamstory.Projects.UserProject{
  user_id: user.id,
  project_id: project.id,
  role: "admin"
})
