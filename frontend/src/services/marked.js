import marked from 'marked'
import { parseYoutubeUrl } from "misago/services/one-box"

const mardkedRenderer = (content) => {
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: false,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: false,
        smartypants: false
    })

    const renderer = new marked.Renderer()

    const headingParse = (text, level) => {
        return `<h${level}>
    <span class="k-heading">${text}</span>
  </h${level}>`
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

    renderer.link = linkParse
    renderer.heading = headingParse

    return marked(content, { renderer })
}

export default mardkedRenderer
