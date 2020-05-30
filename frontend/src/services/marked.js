import marked from 'marked'
import { parseYoutubeUrl } from "misago/services/one-box"

const mardkedRenderer = (content) => {
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: false,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        // highlight: (code) => {
        //     return hljs.highlightAuto(code).value
        // }
    })

    const renderer = new marked.Renderer()

    const headingParse = (text, level) => {
        return `<h${level}>
    <span class="k-heading">${text}</span>
  </h${level}>`
    }
    const paragraphParse = (text) => {
        const markTag = new RegExp(
            '(\\=\\=+)([^\\=\\=]|[^\\=\\=][\\s\\S]*?[^\\=\\=])\\1(?!\\=\\=)',
            'g'
        )

        if (markTag.test(text)) {
            let back = ''
            let textHandle = text
                .replace('\n', ' ')
                .replace(markTag, '\n')
                .split('\n')
            let markTags = text.match(markTag)
            if (textHandle[0].length === 0) {
                markTags.forEach((item, index) => {
                    textHandle = textHandle.filter((el) => !(el.length === 0))
                    textHandle.splice(2 * index, 0, item)
                })
            } else if (textHandle[0].length !== 0) {
                markTags.forEach((item, index) => {
                    textHandle = textHandle.filter((el) => !(el.length === 0))
                    textHandle.splice(2 * index + 1, 0, item)
                })
            }
            textHandle.forEach((item) => {
                if (markTag.test(item)) {
                    back += `<mark>${item.substr(2, item.length - 4)}</mark>`
                } else {
                    back += item + ' '
                }
            })
            return `<p>${back}</p>`
        } else {
            return `<p>${text}</p>`
        }
    }

    const linkParse = (href, title, text) => {
        const ytRegExp = new RegExp(
            "^.*(?:(?:youtu.be/|v/|vi/|u/w/|embed/)|(?:(?:watch)??v(?:i)?=|&v(?:i)?=))([^#&?]*).*"
        )
        if (ytRegExp.test(href)) {
            const youtubeMovie = parseYoutubeUrl(href)
            if (!!youtubeMovie && youtubeMovie.data !== false) {
                let url = "https://www.youtube.com/embed/"
                url += youtubeMovie.video
                url += "?rel=0"
                if (youtubeMovie.start) {
                    url += "&start=" + youtubeMovie.start
                }
                const player = '<iframe class="embed-responsive-item" src="' +
                    url +
                    '" allowfullscreen></iframe>'
                return `<div class="embed-responsive embed-responsive-16by9">${player}</div>`
            }
        }

        return `<a href=${href}
      title=${title || href}
      target='_blank'
      }>${text}</a>`
    }

    renderer.paragraph = paragraphParse
    renderer.link = linkParse
    renderer.heading = headingParse

    return marked(content, { renderer })
}

export default mardkedRenderer
