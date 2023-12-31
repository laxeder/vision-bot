#!/bin/bash

# Atualiza a lista de pacotes
apt update

# Instala o Git e o Node.js LTS
apt install -y git nodejs

# Obtendo repositório do bot
git clone https://github.com/laxeder/vision-bot.git

# Entrando no repositório clonado
cd vision-bot

# Instala as dependências do projeto
npm install

# Criando um link simbólico para o script de inicialização no diretório $PREFIX/bin
ln -s "$(pwd)/start.sh" $PREFIX/bin/start-vision-bot

# Da permissão para executar o script
chmod +x "$(pwd)/start.sh"

echo "O bot foi instalado e o comando 'start-vision-bot' foi adicionado ao sistema."
echo "Você pode iniciar o bot executando 'start-vision-bot' em qualquer lugar no terminal."

# Executa o script de inicialização
sh ./start.sh
