fx_version 'cerulean'
game 'gta5'

name 'Wraith Scoreboard'
description 'Modern Scoreboard Script'
author 'Wraith'
version '1.0.0'

lua54 'yes'

shared_script 'config.lua'

client_scripts {
    'client/bridge.lua',
    'client/main.lua',
}

server_scripts {
    'server/bridge.lua',
    'server/main.lua',
}

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/**/*',
    'public/**/*',
}
