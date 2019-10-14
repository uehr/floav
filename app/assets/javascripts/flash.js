const FLASH_SOHW_SEC = 5000
const FLASH_MSG_CLASS = ".alert"
$(document).ready(() => {
    setTimeout(`$('${FLASH_MSG_CLASS}').fadeOut('slow')`, FLASH_SOHW_SEC)
})