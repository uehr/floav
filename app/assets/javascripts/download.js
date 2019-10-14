const DL_BUTTON_SELECTOR = "#download"
const FILE_NAME = "@<id>-floav.png"

const dataURIToBlob = (dataURI) => {
    var binStr = atob(dataURI.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len),
        mimeString = dataURI.split(',')[0].split(':')[1].split('')[0]

    for (var i = 0; i < len; i++)
        arr[i] = binStr.charCodeAt(i)

    return new Blob([arr], {
        type: mimeString
    })
}

const fileDownload = (src, name) => {
    const a = document.createElement('a')
    a.href = src
    a.download = name

    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

$(document).ready(() => {
    $(DL_BUTTON_SELECTOR).click(() => {
        const canvas = document.getElementById(CANVAS_ID)
        const src = canvas.toDataURL("image/png")
        const name = FILE_NAME.replace("<id>", analyzed_twitter_id)
        fileDownload(src, name)
    })
})