Bridge = {}

local framework = nil
local resourceName = GetCurrentResourceName()
local logoCacheKey = GetGameTimer()

local function detectFramework()
    if Config.Framework ~= 'auto' then
        return Config.Framework
    end

    if GetResourceState('qbx_core') == 'started' then
        return 'qbx'
    end

    if GetResourceState('qb-core') == 'started' then
        return 'qbcore'
    end

    if GetResourceState('es_extended') == 'started' then
        return 'esx'
    end

    return 'standalone'
end

function Bridge.Init()
    framework = detectFramework()
end

function Bridge.GetFramework()
    return framework
end

local function resolvePublicPath(relativePath)
    local path = relativePath:gsub('^/+', '')
    if path:find('^public/') then
        return path
    end
    return 'public/' .. path
end

local function getServerLogoUrl()
    if not Config.UseServerLogo then
        return nil
    end

    local logo = Config.ServerLogo
    if not logo or logo == '' then
        return nil
    end

    return ('https://cfx-nui-%s/%s?v=%d'):format(resourceName, resolvePublicPath(logo), logoCacheKey)
end

function Bridge.BuildNuiPayload(serverData)
    return {
        serverName = serverData.serverName or Config.ServerName,
        onlinePlayers = serverData.onlinePlayers or 0,
        maxSlots = serverData.maxSlots or 48,
        staffCount = serverData.staffCount or 0,
        policeCount = serverData.policeCount or 0,
        jobSections = serverData.jobSections or {},
        players = serverData.players or {},
        robberies = serverData.robberies or {},
        localPlayer = serverData.localPlayer,
        settings = {
            showPlayerList = serverData.showPlayerList ~= nil and serverData.showPlayerList or Config.ShowPlayerList,
            showHeists = Config.ShowHeists,
            showStaffCount = Config.ShowStaffCount,
            pillColors = Config.PillColors or {},
            useServerLogo = Config.UseServerLogo,
            serverLogo = getServerLogoUrl(),
            openKey = Config.OpenKey,
        },
    }
end
