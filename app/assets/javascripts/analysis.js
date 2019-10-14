const API_URL = "/analysis/"
const TWITTER_INPUT_ID = "twitter-id"
const WORD_MAX_SIZE_RATIO_TO_SCREEN = 0.1
const WORD_MIN_SIZE_RATIO_TO_SCREEN = 0.05
const CANVAS_ID = "canvas"
const WORD_LIMIT = 30

const tweetWordsCount = user_id => {
    return $.post(API_URL, { "id": user_id })
}

$(document).ready(() => {
    $("#run-analysis").click(() => {
        const twitter_id = $(`#${TWITTER_INPUT_ID}`).val()
        $("#loading").show()
        tweetWordsCount(twitter_id).done(word_count => {
            const sliced = word_count.slice(0, WORD_LIMIT)
            $("#loading").hide()
            drawWordCloud(CANVAS_ID, sliced, 50)
            $(window).on('resize', () => {
                drawWordCloud(CANVAS_ID, sliced)
            })
        }).fail(res => {
            location.reload()
        })
    })
})

const drawWordCloud = (canvas_id, list) => {
    const height = $(`#${canvas_id}`).height()
    const width = $(`#${canvas_id}`).width()
    const word_size_base = Math.min(height, width)
    $(`#${canvas_id}`).attr("height", height)
    $(`#${canvas_id}`).attr("width", width)

    // ワードサイズを計算
    const word_max_size = Math.round(word_size_base * WORD_MAX_SIZE_RATIO_TO_SCREEN)
    const word_min_size = Math.round(word_size_base * WORD_MIN_SIZE_RATIO_TO_SCREEN)

    // 正規化
    const counts = list.map(ele => { return ele[1] })
    const ratio = Math.max(...counts) / word_max_size
    list.forEach(ele => {
        ele[1] = Math.max(Math.round(ele[1] / ratio), word_min_size)
        console.log(ele[1])
    })

    WordCloud(document.getElementById(canvas_id), { list: list });
}