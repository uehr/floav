const API_URL = "/analysis/"
const NOTIFY_SHOW_MS = 5000
const CANVAS_ID = "canvas"
const TWITTER_ID_SELECTOR = "#twitter-id"
const ANALYSIS_BUTTON_SELECTOR = "#run-analysis"
const LOADING_ANIME_SELECTOR = "#loading"
const APP_DESCRIPTION_SELECTOR = "#app-description"
const ANALYSIS_FORM_SELECTOR = "#anaylsis-form"
const ANALYZED_ID_SELECTOR = "#analyzed-id"
const ANALYZED_ID_FORMAT = "@<id>"
const TWITTER_PROFILE_URL_FORMAT = "https://twitter.com/<id>"
const CANVAS_BACKGROUND_COLOR = "#EEEEEE"
const FADE_IO_MS = 3000
const WORD_LIMIT = 30
const SMARTPHONE_WIDTH = 767
let WORD_MAX_SIZE_RATIO_TO_SCREEN = 0.17
let WORD_MIN_SIZE_RATIO_TO_SCREEN = 0.05
if ($(window).width() <= SMARTPHONE_WIDTH) {
    WORD_MAX_SIZE_RATIO_TO_SCREEN = 0.12
    WORD_MIN_SIZE_RATIO_TO_SCREEN = 0.05
}
let analyzed_twitter_id

const tweetWordsCount = user_id => {
    return $.post(API_URL, { "id": user_id })
}

const clearCanvas = id => {
    const cvs = document.getElementById(id);
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
}

const setAnalyzedId = id => {
    const text = ANALYZED_ID_FORMAT.replace("<id>", id)
    const profile_url = TWITTER_PROFILE_URL_FORMAT.replace("<id>", id)
    $(ANALYZED_ID_SELECTOR).text(text).fadeIn(FADE_IO_MS)
    $(ANALYZED_ID_SELECTOR).attr("href", profile_url)
}

const enableButton = selector => {
    $(selector).removeAttr("disabled")
}

const disableButton = selector => {
    $(selector).attr("disabled", "true")
}

const drawResult = () => {
    const twitter_id = $(TWITTER_ID_SELECTOR).val()
    $(LOADING_ANIME_SELECTOR).show()
    $(APP_DESCRIPTION_SELECTOR).hide()
    disableButton(ANALYSIS_BUTTON_SELECTOR)

    tweetWordsCount(twitter_id).done(word_count => {
        const sliced = word_count.slice(0, WORD_LIMIT)
        $(ANALYZED_ID_SELECTOR).fadeIn(FADE_IO_MS)
        $(LOADING_ANIME_SELECTOR).hide()
        $(TWITTER_ID_SELECTOR).val("")
        enableButton(ANALYSIS_BUTTON_SELECTOR)
        drawWordCloud(CANVAS_ID, sliced, CANVAS_BACKGROUND_COLOR)
        $(window).on('resize', () => {
            drawWordCloud(CANVAS_ID, sliced, CANVAS_BACKGROUND_COLOR)
        });
        setAnalyzedId(twitter_id)
    }).fail(res => {
        const error_msg = res.responseJSON.error
        $.notify(error_msg, {
            autoHideDelay: NOTIFY_SHOW_MS,
        })
        enableButton(ANALYSIS_BUTTON_SELECTOR)
        $(LOADING_ANIME_SELECTOR).fadeOut(FADE_IO_MS)
    })
}

$(document).ready(() => {
    $(ANALYZED_ID_SELECTOR).hide()
    $(APP_DESCRIPTION_SELECTOR).fadeIn(FADE_IO_MS)
    $(ANALYSIS_BUTTON_SELECTOR).click(drawResult)
    $(TWITTER_ID_SELECTOR).on("keydown", function (e) {
        if (e.keyCode === 13) drawResult()
    });
})

const drawWordCloud = (canvas_id, list, background_color) => {
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
    })

    WordCloud(document.getElementById(canvas_id), {
        list: list,
        backgroundColor: background_color
    });
}