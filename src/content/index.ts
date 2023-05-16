import { render } from './render'
import css from './style.css?inline'

// inject css
const style = document.createElement('style')
style.textContent = css
document.body.appendChild(style)

chrome.runtime.onMessage.addListener(render)
