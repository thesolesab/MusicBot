const TelegramApi = require('node-telegram-bot-api')
const easyvk = require('easyvk')
const { default: axios } = require('axios')
const cheerio = require('cheerio')


const token = '5956258595:AAHkmc7neMzsM8qbh2QsNOBjGf4wDZx56fM'


const httpReg = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

const bot = new TelegramApi(token, { polling: true })

bot.setMyCommands([
    { command: '/start', description: 'Начать' },
    { command: '/info', description: 'Информация о боте' }

])


async function parser(link) {
    const data = await axios.get(link).then(data => {

        const $ = cheerio.load(data.data)

        const title = $('div.sidebar__title.sidebar-track__title.deco-type.typo-h2 > span > a').text()
        const artists = $('div.page-album__artists-short > span > a').text()

        return { artists, title }
    })

    return data
}



bot.on('message', async msg => {

    const text = msg?.text
    const chatId = msg?.chat?.id

    try {
        if (!!text.match(httpReg) & !!text.match(/yandex/i)) {
            const sss = await parser(text)

            bot.sendMessage(chatId, `Ты прислал мне трек  \`${sss.artists} - ${sss.title}\``, { parse_mode: 'MarkdownV2' })
            return
        }

        if (!!text.match(httpReg) & !text.match(/yandex/i)) {

            if (text === 'https://t.me/enewi_bot') {
                bot.sendMessage(chatId, `Воу воу воу, секретный режим разблокирован`)
                return
            } else {
                bot.sendMessage(chatId, `Ты прислал мне неверную ссылку`)
                return
            }
        }

        switch (text) {
            case '/start':
                bot.sendMessage(chatId, `Ну наконец-то ${msg.chat.username} решил заглянуть в лучший чат-бот для поиска музыки. Просто пришли мне ссылку на яндекс-музыку и я пришлю тебе название трека =))`)
                break
            case '/info':
                bot.sendMessage(chatId, `В силу ленивости и легкой не компетентности моего разработчика, я умею только лишь возвращать название трека по ссылке на него в яндекс музыку =))`)
                break
            case 'spoty':
                bot.sendMessage(chatId, `Spooooty`)
                break
            default:
                bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз`)
        }
    } catch (error) {
        console.log(error)
    }
})





bot.on('inline_query', async ctx => {
    let query = ctx.query

    // let result = {
    //     type: 'article',
    //     id: Math.random(),
    //     title: 'Вы искали',
    //     input_message_content: {
    //         message_text: `Вы искали ${query}`
    //     }
    // }

    // bot.answerInlineQuery(ctx.id, result)
    console.log(data)

    // console.log(ctx)
})