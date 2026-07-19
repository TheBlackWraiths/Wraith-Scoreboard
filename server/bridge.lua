Bridge = {}

local framework = nil
local QBCore = nil
local ESX = nil
local staffLookup = {}

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

    if framework == 'qbcore' then
        QBCore = exports['qb-core']:GetCoreObject()
    elseif framework == 'esx' then
        ESX = exports['es_extended']:getSharedObject()
    end

    for _, staffGroup in ipairs(Config.StaffGroups) do
        staffLookup[staffGroup] = true
    end
end

function Bridge.GetFramework()
    return framework
end

function Bridge.GetPlayer(source)
    if framework == 'qbx' then
        return exports.qbx_core:GetPlayer(source)
    elseif framework == 'qbcore' then
        return QBCore.Functions.GetPlayer(source)
    elseif framework == 'esx' then
        return ESX.GetPlayerFromId(source)
    end

    return nil
end

function Bridge.GetJobName(player)
    if not player then return nil end

    if framework == 'qbx' or framework == 'qbcore' then
        local job = player.PlayerData and player.PlayerData.job
        return job and job.name or nil
    elseif framework == 'esx' then
        local job = player.job
        return job and job.name or nil
    end

    return nil
end

function Bridge.IsOnDuty(player)
    if not player then return false end

    if framework == 'qbx' or framework == 'qbcore' then
        local job = player.PlayerData and player.PlayerData.job
        return job and job.onduty == true or false
    end

    return true
end

function Bridge.GetGroup(player)
    if not player then return nil end

    if framework == 'qbx' or framework == 'qbcore' then
        local group = player.PlayerData and player.PlayerData.group
        if group then return group end

        local source = player.PlayerData and player.PlayerData.source
        if not source then return nil end

        for _, staffGroup in ipairs(Config.StaffGroups) do
            if framework == 'qbcore' and QBCore then
                if QBCore.Functions.HasPermission(source, staffGroup) then
                    return staffGroup
                end
            elseif framework == 'qbx' then
                local ok, hasPermission = pcall(function()
                    return exports.qbx_core:HasPermission(source, staffGroup)
                end)
                if ok and hasPermission then
                    return staffGroup
                end
            end
        end

        return nil
    elseif framework == 'esx' then
        return player.getGroup and player.getGroup() or nil
    end

    return nil
end

function Bridge.IsStaff(player, source)
    local src = source
        or (player and player.PlayerData and player.PlayerData.source)
        or (player and player.source)

    if Config.UseAmznAdminStaff then
        if not src or GetResourceState('amzn_admin') ~= 'started' then
            return false
        end

        local ok, group = pcall(function()
            return exports.amzn_admin:GetPlayerPermissionGroup(src)
        end)

        return ok and group ~= nil and group ~= 'User'
    end

    local group = Bridge.GetGroup(player)
    return group ~= nil and staffLookup[group] == true
end

function Bridge.GetJobIds(businessKey, businessConfig)
    if type(businessConfig.jobs) == 'table' then
        return businessConfig.jobs
    end

    if type(businessConfig.jobs) == 'string' then
        return { businessConfig.jobs }
    end

    return { businessKey }
end

function Bridge.PlayerHasJob(playerJob, jobIds)
    if not playerJob then return false end

    for i = 1, #jobIds do
        if playerJob == jobIds[i] then
            return true
        end
    end

    return false
end

function Bridge.CountsForBusiness(businessKey, businessConfig, player)
    local playerJob = Bridge.GetJobName(player)
    local jobIds = Bridge.GetJobIds(businessKey, businessConfig)

    if not Bridge.PlayerHasJob(playerJob, jobIds) then
        return false
    end

    if businessConfig.ondutyOnly then
        return Bridge.IsOnDuty(player)
    end

    return true
end

function Bridge.GetBusinessCountKey(sectionKey, businessKey)
    return ('%s:%s'):format(sectionKey, businessKey)
end

function Bridge.IterateBusinesses(callback)
    for sectionKey, sectionConfig in pairs(Config.JobSections or {}) do
        for businessKey, businessConfig in pairs(sectionConfig.businesses or {}) do
            callback(sectionKey, sectionConfig, businessKey, businessConfig)
        end
    end
end

function Bridge.GetSectionPoliceCount(businessCounts, sectionKey)
    local total = 0
    local section = Config.JobSections and Config.JobSections[sectionKey]

    if not section then return 0 end

    for businessKey, businessConfig in pairs(section.businesses or {}) do
        if businessConfig.show ~= false then
            local countKey = Bridge.GetBusinessCountKey(sectionKey, businessKey)
            total = total + (businessCounts[countKey] or 0)
        end
    end

    return total
end

function Bridge.GetPillColor(colorKey)
    local colors = Config.PillColors or {}
    return colors[colorKey] or colors.gray or '#737373'
end

function Bridge.BuildJobSectionsPayload(businessCounts)
    local sections = {}

    for sectionKey, sectionConfig in pairs(Config.JobSections or {}) do
        if sectionConfig.show ~= false then
            local businesses = {}
            local sectionTotal = 0

            for businessKey, businessConfig in pairs(sectionConfig.businesses or {}) do
                if businessConfig.show ~= false then
                    local countKey = Bridge.GetBusinessCountKey(sectionKey, businessKey)
                    local count = businessCounts[countKey] or 0
                    sectionTotal = sectionTotal + count

                    businesses[#businesses + 1] = {
                        id = businessKey,
                        label = businessConfig.label or businessKey,
                        icon = businessConfig.icon or sectionConfig.icon,
                        count = count,
                        active = count > 0,
                        order = businessConfig.order or 999,
                    }
                end
            end

            table.sort(businesses, function(a, b)
                if a.active ~= b.active then
                    return a.active
                end
                if a.order == b.order then
                    return a.label < b.label
                end
                return a.order < b.order
            end)

            sections[#sections + 1] = {
                id = sectionKey,
                label = sectionConfig.label or sectionKey,
                shortLabel = sectionConfig.shortLabel or sectionConfig.label or sectionKey,
                icon = sectionConfig.icon,
                color = sectionConfig.color or 'gray',
                pillColor = Bridge.GetPillColor(sectionConfig.color or 'gray'),
                count = sectionTotal,
                order = sectionConfig.order or 999,
                standalone = sectionConfig.standalone == true,
                businesses = businesses,
            }
        end
    end

    table.sort(sections, function(a, b)
        if a.order == b.order then
            return a.label < b.label
        end
        return a.order < b.order
    end)

    return sections
end

function Bridge.GetMaxSlots()
    return GetConvarInt('sv_maxclients', 48)
end

function Bridge.GetPlayerDisplayName(source, player)
    if framework == 'qbx' or framework == 'qbcore' then
        local charinfo = player.PlayerData and player.PlayerData.charinfo
        if charinfo then
            local first = charinfo.firstname and tostring(charinfo.firstname):match('^%s*(.-)%s*$') or ''
            local last = charinfo.lastname and tostring(charinfo.lastname):match('^%s*(.-)%s*$') or ''
            local fullName = ('%s %s'):format(first, last):match('^%s*(.-)%s*$')

            if fullName and fullName ~= '' then
                return fullName
            end
        end
    elseif framework == 'esx' then
        if player.getName then
            return player.getName()
        end

        local first = player.firstName or player.firstname
        local last = player.lastName or player.lastname
        if first then
            return ('%s %s'):format(first, last or ''):match('^%s*(.-)%s*$')
        end
    end

    return GetPlayerName(source)
end

function Bridge.ResolveJobGroup(playerJob, onDuty)
    local bestOrder = 9999
    local bestKey, bestLabel, bestColor = 'civilian', 'Civilian', 'gray'

    Bridge.IterateBusinesses(function(sectionKey, sectionConfig, businessKey, businessConfig)
        local jobIds = Bridge.GetJobIds(businessKey, businessConfig)

        if Bridge.PlayerHasJob(playerJob, jobIds) then
            if not businessConfig.ondutyOnly or onDuty then
                local order = sectionConfig.order or 999
                if order < bestOrder then
                    bestOrder = order
                    bestKey = sectionKey
                    bestLabel = businessConfig.label or sectionConfig.label or sectionKey
                    bestColor = sectionConfig.color or 'gray'
                end
            end
        end
    end)

    return bestKey, bestLabel, bestColor
end

function Bridge.BuildPlayerEntry(source, player)
    local jobName = Bridge.GetJobName(player)
    local onDuty = Bridge.IsOnDuty(player)
    local _, jobLabel, tagColor = Bridge.ResolveJobGroup(jobName, onDuty)

    return {
        id = source,
        name = Bridge.GetPlayerDisplayName(source, player),
        job = jobLabel,
        jobId = jobName or 'unknown',
        tagColor = tagColor,
        onDuty = onDuty,
        isStaff = Bridge.IsStaff(player, source),
        ping = GetPlayerPing(source) or 0,
    }
end

function Bridge.BuildRobberyList(policeCount)
    local robberies = {}

    for robberyId, robberyConfig in pairs(Config.Robberies) do
        if robberyConfig.show then
            local required = robberyConfig.requiredPolice or 0
            robberies[#robberies + 1] = {
                id = robberyId,
                label = robberyConfig.label,
                icon = robberyConfig.icon,
                requiredPolice = required,
                policeOnline = policeCount,
                available = policeCount >= required,
            }
        end
    end

    table.sort(robberies, function(a, b)
        if a.available ~= b.available then
            return a.available
        end
        return a.label < b.label
    end)

    return robberies
end
