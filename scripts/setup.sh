#!/bin/bash
# Setup script for new machines
# Needs to be run as root

sudo apt-get update
sudo apt-get install -y ntp git emacs-nox zsh nginx yarn wget unzip
sudo apt-get upgrade -y
sudo apt autoremove -y

# setup ntp services
sudo service ntp start
sudo service nginx start

# set up deploy user

cd ~

mkdir -p .emacs.d
echo "(setq make-backup-files nil)" >> ~/.emacs.d/init.el

mkdir -p sites

ssh-keygen -t rsa -b 4096

echo "Add the following to github:"
cat ~/.ssh/id_rsa.pub

read -p "Press enter to continue"

# set up elixir
wget https://packages.erlang-solutions.com/erlang/debian/pool/esl-erlang_25.3-1~debian~bullseye_amd64.deb
sudo apt-get install ./esl* -y

sudo mkdir -p /opt/elixir/1.14
cd /opt/elixir/1.14
sudo wget https://github.com/elixir-lang/elixir/releases/download/v1.14.3/elixir-otp-25.zip
sudo unzip *.zip
sudo ln -sf ./bin/iex /usr/local/bin
sudo ln -sf $(pwd)/bin/mix /usr/local/bin/mix
sudo ln -sf $(pwd)/bin/elixir /usr/local/bin/elixir
sudo ln -sf $(pwd)/bin/elixirc /usr/local/bin/elixir

# clone sites
cd sites
git clone git@github.com:teamstoryai/teamstory.git blue
git clone git@github.com:teamstoryai/teamstory.git green
mix local.hex --force

cd blue
mix deps.get

cd ../green
mix deps.get

