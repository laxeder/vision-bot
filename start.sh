#!/bin/bash

# Obtém o caminho do script
script_path=$(realpath "$0")

# Obtém o diretório do script
script_directory=$(dirname "$script_path")

# Abre o diretório do script
cd "${script_directory}"

# Inicia o bot
sh npm start
