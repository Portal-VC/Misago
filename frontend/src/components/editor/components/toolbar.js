import React from "react"
import classNames from "classnames"
import Upload from "../attachments/upload-button";

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgHidden: true,
            imgList: [],
            paraHidden: true,
            titleHidden: true,
            moreHidden: true,
            listHidden: true
        }
    }

    onClickLeft(type) {
        this.props.onClickLeft(type)
    }
    onClickRight(type) {
        this.props.onClickRight(type)
    }
    listMouseOver() {
        window.clearTimeout(this.listTimer)
        this.setState({
            listHidden: false
        })
    }

    listMouseOut() {
        this.listTimer = window.setTimeout(() => {
            this.setState({
                listHidden: true
            })
        }, 150)
    }

    paraMouseOver() {
        window.clearTimeout(this.paraTimer)
        this.setState({
            paraHidden: false
        })
    }

    paraMouseOut() {
        this.paraTimer = window.setTimeout(() => {
            this.setState({
                paraHidden: true
            })
        }, 150)
    }

    titleMouseOver() {
        window.clearTimeout(this.titleTimer)
        this.setState({
            titleHidden: false
        })
    }

    titleMouseOut() {
        this.titleTimer = window.setTimeout(() => {
            this.setState({
                titleHidden: true
            })
        }, 150)
    }

    moreMouseOver() {
        window.clearTimeout(this.moreTimer)
        this.setState({
            moreHidden: false
        })
    }

    moreMouseOut() {
        this.moreTimer = window.setTimeout(() => {
            this.setState({
                moreHidden: true
            })
        }, 150)
    }
    imgClick() {
        this.setState({
            imgHidden: !this.state.imgHidden
        })
    }

    imgMouseOver() {
        window.clearTimeout(this.timer)
        this.setState({
            imgHidden: false
        })
    }

    imgMouseOut() {
        this.timer = window.setTimeout(() => {
            this.setState({
                imgHidden: true
            })
        }, 150)
    }

    addImgUrl() {
        this.props.onClickLeft('img')
    }

    addImgFile(e) {
        let { imgList } = this.state
        const index = imgList.length
        imgList.push(e.target.files[0])
        this.setState({
            imgList
        })
        this.props.addImg(e.target.files[0], index)
        e.target.value = ''
    }

    render() {
        const { imgHidden, paraHidden, titleHidden, moreHidden, listHidden } = this.state
        const { preview, expand, subfield } = this.props
        const previewActive = classNames({
            'k-active': preview
        })
        const expandActive = classNames({
            'k-active': expand
        })
        const subfieldActive = classNames({
            'k-active': subfield
        })
        return (
            <div className="k-wrapper" >
                <div className="k-pc">
                    <ul>
                        <li onClick={() => this.onClickLeft('undo')} title={`undo (ctrl+z)`}>
                            <span className="material-icon">undo</span>
                        </li>
                        <li onClick={() => this.onClickLeft('redo')} title={`redo (ctrl+y)`}>
                            <span className="material-icon">redo</span>
                        </li>
                        <li
                            className="k-toolbar-title"
                            onMouseOver={() => this.titleMouseOver()}
                            onMouseOut={() => this.titleMouseOut()}
                            onClick={() => this.titleMouseOut()}
                        >
                            <span className="material-icon">title</span>
                            <ul style={titleHidden ? { display: 'none' } : {}}>
                                <li onClick={() => this.onClickLeft('h1')} title="Header 1">
                                    Header 1
                                </li>
                                <li onClick={() => this.onClickLeft('h2')} title="Header 2">
                                    Header 2
                                </li>
                                <li onClick={() => this.onClickLeft('h3')} title="Header 3">
                                    Header 3
                                </li>
                                <li onClick={() => this.onClickLeft('h4')} title="Header 4">
                                    Header 4
                                </li>
                                <li onClick={() => this.onClickLeft('h5')} title="Header 5">
                                    Header 5
                                </li>
                                <li onClick={() => this.onClickLeft('h6')} title="Header 6">
                                    Header 6
                                </li>
                            </ul>
                        </li>
                        <li
                            className="k-toolbar-para"
                            onMouseOver={() => this.paraMouseOver()}
                            onMouseOut={() => this.paraMouseOut()}
                            onClick={() => this.paraMouseOut()}
                        >
                            <span className="material-icon">text_fields</span>
                            <ul style={paraHidden ? { display: 'none' } : {}}>
                                <li onClick={() => this.onClickLeft('italic')} title="italic">
                                    italic
                                </li>
                                <li onClick={() => this.onClickLeft('bold')} title="bold">
                                    bold
                                </li>
                                <li onClick={() => this.onClickLeft('bolditalic')} title="bolditalic">
                                    bolditalic
                                </li>
                                <li onClick={() => this.onClickLeft('delline')} title="strike through">
                                    strike through
                                </li>
                                <li onClick={() => this.onClickLeft('underline')} title="underline">
                                    underline
                                </li>
                            </ul>
                        </li>
                        <li
                            className="k-toolbar-img"
                            onMouseOver={() => this.imgMouseOver()}
                            onMouseOut={() => this.imgMouseOut()}
                            onClick={() => this.imgMouseOut()}
                        >
                            <span className="material-icon">perm_media</span>
                            <ul style={imgHidden ? { display: 'none' } : {}}>
                                <li onClick={() => this.addImgUrl()}>Insert image link</li>
                                <Upload
                                    disable={this.props.loading}
                                />
                            </ul>
                        </li>
                        <li onClick={() => this.onClickLeft('quote')} title="quote">
                            <span className="material-icon">format_quote</span>
                        </li>
                        <li onClick={() => this.onClickLeft('link')} title="link">
                            <span className="material-icon">link</span>
                        </li>
                        <li onClick={() => this.onClickLeft('code')} title="code">
                            <span className="material-icon">code</span>
                        </li>
                        <li onClick={() => this.onClickLeft('spoiler')} title="spoiler">
                            <span className="material-icon">priority_high</span>
                        </li>
                    </ul>
                </div>
                <div className="k-mobile">
                    <ul>
                        <li onClick={() => this.onClickLeft('undo')} title={`undo (ctrl+z)`}>
                            <span className="material-icon">undo</span>
                        </li>
                        <li onClick={() => this.onClickLeft('redo')} title={`redo (ctrl+y)`}>
                            <span className="material-icon">redo</span>
                        </li>
                        <li
                            className="k-toolbar-title"
                            onMouseOver={() => this.titleMouseOver()}
                            onMouseOut={() => this.titleMouseOut()}
                            onClick={() => this.titleMouseOut()}
                        >
                            <span className="material-icon">title</span>
                            <ul style={titleHidden ? { display: 'none' } : {}}>
                                <li onClick={() => this.onClickLeft('h1')} title="Header 1">
                                    Header 1
                                </li>
                                <li onClick={() => this.onClickLeft('h2')} title="Header 2">
                                    Header 2
                                </li>
                                <li onClick={() => this.onClickLeft('h3')} title="Header 3">
                                    Header 3
                                </li>
                                <li onClick={() => this.onClickLeft('h4')} title="Header 4">
                                    Header 4
                                </li>
                                <li onClick={() => this.onClickLeft('h5')} title="Header 5">
                                    Header 5
                                </li>
                                <li onClick={() => this.onClickLeft('h6')} title="Header 6">
                                    Header 6
                                </li>
                            </ul>
                        </li>
                        <li
                            className="k-toolbar-para"
                            onMouseOver={() => this.paraMouseOver()}
                            onMouseOut={() => this.paraMouseOut()}
                            onClick={() => this.paraMouseOut()}
                        >
                            <span className="material-icon">text_fields</span>
                            <ul style={paraHidden ? { display: 'none' } : {}}>
                                <li onClick={() => this.onClickLeft('italic')} title="italic">
                                    italic
                                </li>
                                <li onClick={() => this.onClickLeft('bold')} title="bold">
                                    bold
                                </li>
                                <li onClick={() => this.onClickLeft('bolditalic')} title="bolditalic">
                                    bolditalic
                                </li>
                                <li onClick={() => this.onClickLeft('delline')} title="strike through">
                                    strike through
                                </li>
                                <li onClick={() => this.onClickLeft('underline')} title="underline">
                                    underline
                                </li>
                            </ul>
                        </li>
                        <li
                            className="k-toolbar-img"
                            onMouseOver={() => this.imgMouseOver()}
                            onMouseOut={() => this.imgMouseOut()}
                            onClick={() => this.imgMouseOut()}
                        >
                            <span className="material-icon">perm_media</span>
                            <ul style={imgHidden ? { display: 'none' } : {}}>
                                <li onClick={() => this.addImgUrl()}>Insert image link</li>
                                <Upload
                                    disable={this.props.loading}
                                />
                            </ul>
                        </li>
                        <li onClick={() => this.onClickLeft('quote')} title="quote">
                            <span className="material-icon">format_quote</span>
                        </li>
                        <li onClick={() => this.onClickLeft('link')} title="link">
                            <span className="material-icon">link</span>
                        </li>
                        <li onClick={() => this.onClickLeft('code')} title="code">
                            <span className="material-icon">code</span>
                        </li>
                        <li onClick={() => this.onClickLeft('spoiler')} title="spoiler">
                            <span className="material-icon">priority_high</span>
                        </li>
                    </ul>
                </div>
                <div className="k-right-pc">
                    <ul>
                        <li
                            className={expandActive}
                            onClick={() => this.onClickRight('expand')}
                            title={expandActive}
                        >
                            {expandActive ? (
                                <span className="material-icon">fullscreen_exit</span>
                            ) : (
                                    <span className="material-icon">fullscreen</span>
                                )}
                        </li>
                        <li
                            className={previewActive}
                            onClick={() => this.onClickRight('preview')}
                            title="preview"
                        >
                            {previewActive ? (
                                <span className="material-icon">visibility</span>
                            ) : (
                                    <span className="material-icon">visibility_off</span>
                                )}
                        </li>
                        <li
                            className={subfieldActive}
                            onClick={() => this.onClickRight('subfield')}
                            title={subfieldActive ? "Split preview" : "Merge split"}
                        >
                            <span className="material-icon">chrome_reader_mode</span>
                        </li>
                    </ul>
                </div>
                <div className="k-right-mobile">
                    <ul>
                        <li
                            className={expandActive}
                            onClick={() => this.onClickRight('expand')}
                            title={expandActive}
                        >
                            {expandActive ? (
                                <span className="material-icon">fullscreen_exit</span>
                            ) : (
                                    <span className="material-icon">fullscreen</span>
                                )}
                        </li>
                        <li
                            className={previewActive}
                            onClick={() => this.onClickRight('preview')}
                            title="preview"
                        >
                            {previewActive ? (
                                <span className="material-icon">visibility</span>
                            ) : (
                                    <span className="material-icon">visibility_off</span>
                                )}
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}