// Description:
//   Outputs all the permissions of the bot (if using the discord adapter) to the console
//

import { Client, Guild, PermissionFlags } from 'discord.js'
import { Robot } from 'hubot'

const P_FLAGS: PermissionFlags = { // From discord.js
    CREATE_INSTANT_INVITE: 1 << 0,
    KICK_MEMBERS: 1 << 1,
    BAN_MEMBERS: 1 << 2,
    ADMINISTRATOR: 1 << 3,
    MANAGE_CHANNELS: 1 << 4,
    MANAGE_GUILD: 1 << 5,
    ADD_REACTIONS: 1 << 6,
    VIEW_AUDIT_LOG: 1 << 7,

    VIEW_CHANNEL: 1 << 10,
    READ_MESSAGES: 1 << 10,
    SEND_MESSAGES: 1 << 11,
    SEND_TTS_MESSAGES: 1 << 12,
    MANAGE_MESSAGES: 1 << 13,
    EMBED_LINKS: 1 << 14,
    ATTACH_FILES: 1 << 15,
    READ_MESSAGE_HISTORY: 1 << 16,
    MENTION_EVERYONE: 1 << 17,
    EXTERNAL_EMOJIS: 1 << 18,
    USE_EXTERNAL_EMOJIS: 1 << 18,

    CONNECT: 1 << 20,
    SPEAK: 1 << 21,
    MUTE_MEMBERS: 1 << 22,
    DEAFEN_MEMBERS: 1 << 23,
    MOVE_MEMBERS: 1 << 24,
    USE_VAD: 1 << 25,

    CHANGE_NICKNAME: 1 << 26,
    MANAGE_NICKNAMES: 1 << 27,
    MANAGE_ROLES: 1 << 28,
    MANAGE_ROLES_OR_PERMISSIONS: 1 << 28,
    MANAGE_WEBHOOKS: 1 << 29,
    MANAGE_EMOJIS: 1 << 30,
}

const PERMISSION_ORDER: Array<[string, Array<keyof PermissionFlags>]> = [
    ['GENERAL PERMISSIONS', ['ADMINISTRATOR', 'VIEW_AUDIT_LOG', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'KICK_MEMBERS', 'BAN_MEMBERS',
                             'CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_EMOJIS', 'MANAGE_WEBHOOKS', 'VIEW_CHANNEL']],
    ['TEXT PERMISSIONS', ['SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY',
                          'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS']],
    ['VOICE PERMISSIONS', ['CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD']]
]

const PERMISSION_CHECK_SPACE = 2 // Number of characters the space + check/x will take
const PERMISSION_WIDTHS = PERMISSION_ORDER.map(([name, items]) => Math.max(name.length, ...items.map((i) => i.length + PERMISSION_CHECK_SPACE)))
const TABLE_PADDING = 2 // Space between columns

/**
 * Returns the permissions of the bot in a given guild
 */
async function getPermissions(robot: Robot, guild: Guild): Promise<Map<string, boolean>> {
    const member = guild.members.array().find((gm) => gm.user.username === robot.name)
    if (!member) throw new Error('Could not find bot in guild')
    const pValues = Object.entries(P_FLAGS).map<[string, boolean]>(([key, val]) => [key, member.permissions.hasPermission(val as number)])
    return new Map(pValues)
}

/**
 * Converts a string in the format `MY_STRING` to `My String`
 */
function formatPermissionName(name: string): string {
    return name.split('_').map((word) => word.charAt(0) + word.substring(1).toLowerCase()).join(' ')
}

/**
 * Returns a string with a formatted permission table
 */
function formatPermissions(permissions: Map<string, boolean>): string {
    const columns: string[][] = PERMISSION_ORDER.map(([name, items]) => [name])
    PERMISSION_ORDER.forEach(([name, items], index) => {
        items.forEach((item) => {
            const fname = formatPermissionName(item)
            const status = permissions.get(item) ? '✔' : '❌'
            columns[index].push(`${fname} ${status}`)
        })
    })

    const cMaxHeight = Math.max(...columns.map((c) => c.length))
    const out: string[] = []
    const formatColumnItem = (column: string[], index: number, i: number) => {
        if (column[i]) return column[i] + ' '.repeat(PERMISSION_WIDTHS[index] - column[i].length + TABLE_PADDING)
        return ' '.repeat(PERMISSION_WIDTHS[index] + TABLE_PADDING)
    }
    for (let i = 0; i < cMaxHeight; i++) {
        out.push(columns.map((column, index) => formatColumnItem(column, index, i)).join('').trimRight())
    }

    return out.join('\n')
}

module.exports = (robot: Robot) => {
    if (robot.adapterName !== 'discord') return

    const client = (robot.adapter as any).client as Client
    for (const guild of client.guilds.values()) {
        getPermissions(robot, guild).then((permissions) => {
            console.log(guild.name)
            console.log('-'.repeat(guild.name.length))
            console.log(formatPermissions(permissions))
            console.log()
        }, (e) => {
            console.error(guild.name, e)
        })
    }
}
