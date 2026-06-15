local resourceName = GetCurrentResourceName()
local debugEnabled = GetConvarInt(('%s-debugMode'):format(resourceName), 0) == 1 or Config.Debug

local isOpen = false
local nuiFocused = false
local overheadIdsActive = false
local HEAD_BONE = 31086
local HEAD_OFFSET_Z = 0.55

local function debugPrint(...)
    if not debugEnabled then return end
    local parts = {}
    for i = 1, select('#', ...) do
        parts[#parts + 1] = tostring(select(i, ...))
    end
    print(('^3[%s]^0 %s'):format(resourceName, table.concat(parts, ' ')))
end

local function sendNui(action, data)
    SendNUIMessage({ action = action, data = data })
end

local function getHeadCoords(ped)
    local boneIndex = GetPedBoneIndex(ped, HEAD_BONE)
    local coords = GetPedBoneCoords(ped, boneIndex, 0.0, 0.0, HEAD_OFFSET_Z)
    return coords.x, coords.y, coords.z
end

local function drawOverheadText(x, y, z, text)
    local onScreen, screenX, screenY = World3dToScreen2d(x, y, z)
    if not onScreen then return end

    local camCoords = GetGameplayCamCoord()
    local distance = math.max(#(camCoords - vector3(x, y, z)), 2.5)
    local scale = math.min(math.max(0.35 * (2.0 / distance) * (100.0 / GetGameplayCamFov()), 0.28), 0.42)

    SetTextScale(0.0, scale)
    SetTextFont(4)
    SetTextProportional(true)
    SetTextColour(255, 255, 255, 220)
    SetTextOutline()
    SetTextCentre(true)
    BeginTextCommandDisplayText('STRING')
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandDisplayText(screenX, screenY)
end

local function renderOverheadIds()
    local cfg = Config.OverheadIds
    if not cfg or not cfg.enabled or not overheadIdsActive then return end

    local maxDistance = cfg.maxDistance or 50.0
    local prefix = cfg.prefix or ''
    local showSelf = cfg.showSelf ~= false
    local camCoords = GetGameplayCamCoord()
    local localPlayer = PlayerId()

    for _, playerId in ipairs(GetActivePlayers()) do
        local ped = GetPlayerPed(playerId)
        if ped ~= 0 and DoesEntityExist(ped) then
            local isSelf = playerId == localPlayer
            if showSelf or not isSelf then
                if isSelf or (IsEntityOnScreen(ped) and not IsEntityDead(ped)) then
                    local headX, headY, headZ = getHeadCoords(ped)
                    if #(camCoords - vector3(headX, headY, headZ)) <= maxDistance then
                        drawOverheadText(headX, headY, headZ, prefix .. GetPlayerServerId(playerId))
                    end
                end
            end
        end
    end
end

local function setNuiFocused(focused)
    if not isOpen then return end

    nuiFocused = focused == true
    SetNuiFocus(nuiFocused, nuiFocused)
    sendNui('scoreboardFocus', { focused = nuiFocused })
    debugPrint('Scoreboard focus:', nuiFocused and 'on' or 'off')
end

local function toggleNuiFocus()
    if isOpen then
        setNuiFocused(not nuiFocused)
    end
end

local function openScoreboard()
    if isOpen then return end

    isOpen = true
    nuiFocused = true
    overheadIdsActive = true
    SetNuiFocus(true, true)
    sendNui('openScoreboard', {})
    sendNui('scoreboardFocus', { focused = true })
    TriggerServerEvent('w-scoreboard:server:setOpen', true)
    TriggerServerEvent('w-scoreboard:server:requestData')
    debugPrint('Scoreboard opened')
end

local function closeScoreboard()
    if not isOpen then return end

    isOpen = false
    nuiFocused = false
    overheadIdsActive = false
    SetNuiFocus(false, false)
    sendNui('closeScoreboard', {})
    sendNui('scoreboardFocus', { focused = false })
    TriggerServerEvent('w-scoreboard:server:setOpen', false)
    debugPrint('Scoreboard closed')
end

local function toggleScoreboard()
    if isOpen then
        closeScoreboard()
    else
        openScoreboard()
    end
end

CreateThread(function()
    Bridge.Init()
    debugPrint('Framework detected:', Bridge.GetFramework())
end)

CreateThread(function()
    while true do
        if overheadIdsActive and Config.OverheadIds and Config.OverheadIds.enabled then
            renderOverheadIds()
            Wait(0)
        else
            Wait(500)
        end
    end
end)

RegisterCommand('w-scoreboard', toggleScoreboard, false)
RegisterKeyMapping('w-scoreboard', 'Toggle Scoreboard', 'keyboard', Config.OpenKey)

RegisterCommand('w-scoreboard-focus', toggleNuiFocus, false)
RegisterKeyMapping('w-scoreboard-focus', 'Toggle Scoreboard Focus', 'keyboard', Config.FocusToggleKey or 'TAB')

RegisterNetEvent('w-scoreboard:client:updateData', function(serverData)
    if isOpen then
        sendNui('updateScoreboard', Bridge.BuildNuiPayload(serverData))
    end
end)

RegisterNUICallback('closeScoreboard', function(_, cb)
    closeScoreboard()
    cb('ok')
end)

RegisterNUICallback('toggleScoreboardFocus', function(_, cb)
    toggleNuiFocus()
    cb({ focused = nuiFocused })
end)

exports('OpenScoreboard', openScoreboard)
exports('CloseScoreboard', closeScoreboard)
exports('ToggleScoreboard', toggleScoreboard)
exports('ToggleScoreboardFocus', toggleNuiFocus)
exports('IsScoreboardOpen', function() return isOpen end)
exports('IsScoreboardFocused', function() return nuiFocused end)
