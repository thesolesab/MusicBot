const TelegramApi = require('node-telegram-bot-api')
const easyvk = require('easyvk')
const { default: axios } = require('axios')
const cheerio = require('cheerio')
require('dotenv').config()

const token = process.env.TOKEN


const httpReg = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

const bot = new TelegramApi(token, { polling: true })

async function parser(link) {
    const data = await axios.get(link).then(data => {
        console.log(data);
        const path = { title: '', artists: '' }
        const $ = cheerio.load(data.data)


        if (!!link.match(/yandex/i)) {
            path.title = 'div.sidebar__title.sidebar-track__title.deco-type.typo-h2 > span > a'
            path.artists = 'div.page-album__artists-short > span > a'
        }
        if (!!link.match(/spotify/i)) {
            path.title = 'title'
            path.artists = ''
        }


        const title = $(path.title).text()
        const artists = $(path.artists).text()

        return { artists, title }
    })

    return data
}


const start = async () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начать' },
        { command: '/info', description: 'Информация о боте' }

    ])

    bot.on('message', async msg => {

        const text = msg?.text
        const chatId = msg?.chat?.id

        try {
            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/c86/acf/c86acfa0-4fbc-3b4d-8b38-f8870d09f971/192/9.webp')
                return bot.sendMessage(chatId, `Ну наконец-то ${msg.chat.username} решил заглянуть в лучший чат-бот для поиска музыки. Просто пришли мне ссылку на яндекс-музыку и я пришлю тебе название трека =))`)
            }

            if (text === '/info') {
                return bot.sendMessage(chatId, `В силу ленивости и легкой не компетентности моего разработчика, я умею только лишь возвращать название трека по ссылке на него в яндекс музыку =))`)
            }

            if (!!text.match(httpReg)) {
                const sss = await parser(text)

                bot.sendMessage(chatId, `Ты прислал мне трек  \`${sss.artists} - ${sss.title}\``, { parse_mode: 'MarkdownV2' })
                return
            }

            return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз`)

        } catch (error) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)')
        }
    })
}

start()