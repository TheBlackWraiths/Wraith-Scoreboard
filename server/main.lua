local resourceName = GetCurrentResourceName()
local debugEnabled = GetConvarInt(('%s-debugMode'):format(resourceName), 0) == 1 or Config.Debug

local cache = {
    onlinePlayers = 0,
    staffCount = 0,
    businessCounts = {},
    jobSections = {},
    policeCount = 0,
    players = {},
    robberies = {},
    maxSlots = 48,
    serverName = Config.ServerName,
}

local openClients = {}

local getCachePayload
local refreshCache

local function debugPrint(...)
    if not debugEnabled then return end
    local parts = {}
    for i = 1, select('#', ...) do
        parts[#parts + 1] = tostring(select(i, ...))
    end
    print(('^3[%s]^0 %s'):format(resourceName, table.concat(parts, ' ')))
end

local function initBusinessCounts()
    local counts = {}

    Bridge.IterateBusinesses(function(sectionKey, _, businessKey)
        counts[Bridge.GetBusinessCountKey(sectionKey, businessKey)] = 0
    end)

    return counts
end

local function canViewPlayerList(forSource)
    if not Config.ShowPlayerList then
        return false
    end

    if not Config.PlayerListAdminOnly then
        return true
    end

    if not forSource then
        return false
    end

    local player = Bridge.GetPlayer(forSource)
    return player ~= nil and Bridge.IsStaff(player)
end

getCachePayload = function(forSource)
    local showPlayerList = canViewPlayerList(forSource)
    local payload = {
        onlinePlayers = cache.onlinePlayers,
        staffCount = cache.staffCount,
        jobSections = cache.jobSections,
        policeCount = cache.policeCount,
        players = showPlayerList and cache.players or {},
        robberies = cache.robberies,
        maxSlots = cache.maxSlots,
        serverName = cache.serverName,
        showPlayerList = showPlayerList,
    }

    if forSource then
        local player = Bridge.GetPlayer(forSource)
        if player then
            payload.localPlayer = Bridge.BuildPlayerEntry(forSource, player)
        end
    end

    return payload
end

refreshCache = function()
    local businessCounts = initBusinessCounts()
    local staffCount = 0
    local onlinePlayers = 0
    local playerList = {}

    for _, playerId in ipairs(GetPlayers()) do
        local src = tonumber(playerId)
        if src then
            onlinePlayers = onlinePlayers + 1
            local player = Bridge.GetPlayer(src)

            if player then
                if Bridge.IsStaff(player) then
                    staffCount = staffCount + 1
                end

                Bridge.IterateBusinesses(function(sectionKey, _, businessKey, businessConfig)
                    if businessConfig.show ~= false and Bridge.CountsForBusiness(businessKey, businessConfig, player) then
                        local countKey = Bridge.GetBusinessCountKey(sectionKey, businessKey)
                        businessCounts[countKey] = (businessCounts[countKey] or 0) + 1
                    end
                end)

                playerList[#playerList + 1] = Bridge.BuildPlayerEntry(src, player)
            end
        end
    end

    table.sort(playerList, function(a, b)
        return a.id < b.id
    end)

    local policeGroup = Config.RobberyPoliceGroup or 'law_enforcement'
    local policeCount = Bridge.GetSectionPoliceCount(businessCounts, policeGroup)

    cache.onlinePlayers = onlinePlayers
    cache.staffCount = staffCount
    cache.businessCounts = businessCounts
    cache.jobSections = Bridge.BuildJobSectionsPayload(businessCounts)
    cache.policeCount = policeCount
    cache.players = playerList
    cache.robberies = Config.ShowHeists and Bridge.BuildRobberyList(policeCount) or {}
    cache.maxSlots = Bridge.GetMaxSlots()
    cache.serverName = Config.ServerName

    debugPrint('Cache refreshed — players:', onlinePlayers, 'staff:', staffCount)

    for clientSource in pairs(openClients) do
        TriggerClientEvent('w-scoreboard:client:updateData', clientSource, getCachePayload(clientSource))
    end
end

CreateThread(function()
    Bridge.Init()
    debugPrint('Framework detected:', Bridge.GetFramework())
    refreshCache()

    while true do
        Wait(Config.UpdateInterval)
        refreshCache()
    end
end)

RegisterNetEvent('w-scoreboard:server:requestData', function()
    local src = source
    TriggerClientEvent('w-scoreboard:client:updateData', src, getCachePayload(src))
end)

RegisterNetEvent('w-scoreboard:server:setOpen', function(isOpen)
    local src = source

    if isOpen then
        openClients[src] = true
        TriggerClientEvent('w-scoreboard:client:updateData', src, getCachePayload(src))
    else
        openClients[src] = nil
    end
end)

AddEventHandler('playerDropped', function()
    openClients[source] = nil
end)

exports('GetScoreboardCache', getCachePayload)
exports('RefreshScoreboardCache', refreshCache)
