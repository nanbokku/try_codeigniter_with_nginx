Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.synced_folder ".", "/vagrant", type: "virtualbox"
  config.vm.provision "docker"
  config.vm.provision "docker_compose", yml: "/vagrant/docker-compose.yml", run: "always"
end
