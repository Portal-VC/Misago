import React from "react"
import AttachmentsEditor from "./attachments"
import * as textUtils from "./textutils"
import Button from "misago/components/button"
import misago from "misago"
import classNames from "classnames"
import marked from "misago/services/marked"
import Toolbar from "./components/toolbar"
import { insertText } from "./utils/helper/text"
import keydownListen from "./utils/helper/keyboard"

export default class extends React.Component {
  static defaultProps = {
    fontSize: '18px',
    expand: true
  }
  constructor(props) {
    super(props)

    this.state = {
      lineIndex: 1,
      preview: false,
      expand: props.expand,
      subfield: false,
      history: [],
      historyIndex: 0,
      mobile: false,
      allowPrompt: true,
      areYouReallySure: false
    }
  }

  componentDidMount() {
    this.textarea = document.getElementById("editor-textarea")
    this.blockEdit = document.getElementById("blockEdit")
    this.reHeight()
    this.focusText()

    this.textarea.scrollTop = this.textarea.scrollHeight
    this.textarea.setSelectionRange(this.textarea.value.length, this.textarea.value.length)

    $("#editor-textarea").atwho({
      at: "@",
      displayTpl: '<li><img src="${avatar}" alt="">${username}</li>',
      insertTpl: "@${username}",
      searchKey: "username",
      callbacks: {
        remoteFilter: function (query, callback) {
          $.getJSON(misago.get("MENTION_API"), { q: query }, callback)
        }
      }
    })

    $("#editor-textarea").on("inserted.atwho", (event, flag, query) => {
      this.props.onChange(event.target.value)
    })

    this.resize()
    window.addEventListener('resize', () => {
      this.resize()
    })
    $(window).on('beforeunload', (e) => this._areYouSure(e));

    $(document).on("submit", "form", function (event) {
      console.log(event)
      $(window).off('beforeunload');
    })
  }

  componentDidUpdate(preProps) {
    const { historyIndex, history } = this.state
    const { value } = this.props
    if (value !== preProps.value) {
      this.reHeight()
    }
    if (value !== history[historyIndex]) {
      window.clearTimeout(this.currentTimeout)
      this.currentTimeout = window.setTimeout(() => {
        this.saveHistory(value)
      }, 500)
    }
  }

  _areYouSure = (e) => {
    const { areYouReallySure, historyIndex } = this.state
    console.log(e)
    if (historyIndex != 0) {
      if (!areYouReallySure) {
        this.setState({ areYouReallySure: true })
        return "Are you sure you want leave ? The changes will not be saved.";
      }
    }
  }

  onKeyDown = (e) => {
    keydownListen(e, (type) => {
      this.leftToolBarClick(type)
    })
  }

  replaceSelection = operation => {
    operation(textUtils.getSelectionText(), this._replaceSelection)
  }

  _replaceSelection = newValue => {
    this.props.onChange(textUtils.replace(newValue))
  }

  resize = () => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      this.setState({
        preview: true,
        subfield: true,
        expand: this.props.expand
      })
    } else {
      this.setState({
        preview: false,
        subfield: false
      })
    }
  }


  focusText = () => {
    this.textarea.focus()
  }

  reHeight = () => {
    this.textarea.style.height = ''
    this.textarea.style.height = this.textarea.scrollHeight + 'px'
  }

  saveHistory = (value) => {
    let { history, historyIndex } = this.state
    history.splice(historyIndex + 1, history.length)
    if (history.length >= 20) {
      history.shift()
    }
    historyIndex = history.length
    history.push(value)
    this.setState({
      history,
      historyIndex
    })
  }

  undo = () => {
    let { history, historyIndex } = this.state
    historyIndex = historyIndex - 1
    if (historyIndex < 0) return
    this.props.onChange(history[historyIndex])
    this.setState({
      historyIndex
    })
  }

  redo = () => {
    let { history, historyIndex } = this.state
    historyIndex = historyIndex + 1
    if (historyIndex >= history.length) return
    this.props.onChange(history[historyIndex])
    this.setState({
      historyIndex
    })
  }

  leftToolBarClick = type => {
    const typeObj = {
      h1: {
        prefix: '# ',
        subfix: '',
        str: "Header 1"
      },
      h2: {
        prefix: '## ',
        subfix: '',
        str: "Header 2"
      },
      h3: {
        prefix: '### ',
        subfix: '',
        str: "Header 3"
      },
      h4: {
        prefix: '#### ',
        subfix: '',
        str: "Header 4"
      },
      h5: {
        prefix: '##### ',
        subfix: '',
        str: "Header 5"
      },
      h6: {
        prefix: '###### ',
        subfix: '',
        str: "Header 6"
      },
      quote: {
        prefix: '[quote= @',
        subfix: ']\n[/quote]',
        str: "username"
      },
      italic: {
        prefix: '_',
        subfix: '_',
        str: "italic"
      },
      bold: {
        prefix: '**',
        subfix: '**',
        str: "bold"
      },
      bolditalic: {
        prefix: '***',
        subfix: '***',
        str: "bold italic"
      },
      delline: {
        prefix: '~~',
        subfix: '~~',
        str: "delete line"
      },
      underline: {
        prefix: '<u>',
        subfix: '</u>',
        str: "underline"
      },
      superscript: {
        prefix: 'x<sup>',
        subfix: '</sup>',
        str: 'y'
      },
      subscript: {
        prefix: 'a<sub>',
        subfix: '</sub>',
        str: ''
      },
      table: {
        prefix: '',
        subfix: '',
        str:
          '| title      | description     |\n| ---------- | --------------- |\n| for-editor | markdown editor |\n'
      },
      img: {
        prefix: '![alt](',
        subfix: ')',
        str: 'url'
      },
      link: {
        prefix: '[title](',
        subfix: ')',
        str: 'url'
      },
      orderlist: {
        prefix: '\n1. ',
        subfix: '',
        str: 'item'
      },
      disorderlist: {
        prefix: '\n- ',
        subfix: '',
        str: 'item'
      },
      checklist: {
        prefix: '\n- [x] ',
        subfix: '',
        str: 'item'
      },
      inlinecode: {
        prefix: '`',
        subfix: '`',
        str: "inlinecode"
      },
      code: {
        prefix: '```',
        subfix: '\n\n```',
        str: 'language'
      },
      tab: {
        prefix: '  ',
        subfix: '',
        str: ''
      },
      spoiler: {
        prefix: "[spoiler]\n",
        subfix: "\n[/spoiler]",
        str: ""
      }
    }

    if (typeObj.hasOwnProperty(type)) {
      const value = insertText(typeObj[type])
      this.props.onChange(value)
    }
    const otherLeftClick = {
      undo: this.undo,
      redo: this.redo,
      esc: this.exitFullScreen
    }
    if (otherLeftClick.hasOwnProperty(type)) {
      otherLeftClick[type]()
    }

  }

  exitFullScreen = () => {
    this.setState({
      expand: false
    })
  }

  rightToolbarClick = (type) => {
    const toolbarRightPreviewClick = () => {
      this.setState({
        preview: !this.state.preview
      })
    }
    const toolbarRightExpandClick = () => {
      this.setState({
        expand: !this.state.expand
      })
    }

    const toolbarRightSubfieldClick = () => {
      const { preview, subfield } = this.state
      if (subfield) {
        this.reHeight()
      }
      if (preview) {
        if (subfield) {
          this.setState({
            subfield: false,
            preview: false
          })
        } else {
          this.setState({
            subfield: true
          })
        }
      } else {
        if (subfield) {
          this.setState({
            subfield: false
          })
        } else {
          this.setState({
            preview: true,
            subfield: true
          })
        }
      }
    }
    const rightClick = {
      preview: toolbarRightPreviewClick,
      expand: toolbarRightExpandClick,
      subfield: toolbarRightSubfieldClick
    }
    if (rightClick.hasOwnProperty(type)) {
      rightClick[type]()
    }
  }

  handleChange = e => {
    const value = e.target.value
    this.props.onChange(value)
  }

  render() {
    const { preview, expand, subfield } = this.state
    const { value, loading, height, fontSize } = this.props


    const fullscreen = classNames({
      'k-container': true,
      'k-fullscreen': expand
    })

    const editorClass = classNames({
      'k-editor-edit': true,
      'k-panel': true,
      'k-active': preview && subfield,
      'k-edit-preview': preview && !subfield
    })
    const previewClass = classNames({
      'k-panel': true,
      'k-editor-preview': true,
      'k-active': preview && subfield
    })

    return (
      <div className={fullscreen} style={{ height }}>
        <Toolbar
          expand={expand}
          subfield={subfield}
          preview={preview}
          onClickLeft={this.leftToolBarClick}
          onClickRight={this.rightToolbarClick}
          loading={loading}
        />
        <div className="k-editor" style={{ fontSize }}>
          <div
            className={editorClass}
            id="blockEdit"
            onClick={this.focusText}
          >
            <div className="k-editor-block">
              <div className="k-editor-content">
                <pre id="true-value">{value}</pre>
                <textarea
                  value={value}
                  disabled={loading}
                  id="editor-textarea"
                  onChange={e => this.handleChange(e)}
                  onKeyDown={this.onKeyDown}
                  placeholder={"Write Something"}
                />
              </div>
            </div>
          </div>
          <div className={previewClass}>
            <div
              id="k-preview"
              className="k-preview k-markdown-preview"
              dangerouslySetInnerHTML={{ __html: marked(value) }}
            />
          </div>
        </div>
        <div className="editor-footer" style={{ overflow: 'hidden', padding: '10px' }}>
          <Button
            className="btn-primary btn-sm pull-right"
            loading={this.props.loading}
          >
            {this.props.submitLabel || gettext("Post")}
          </Button>
          <button
            className="btn btn-default btn-sm pull-right"
            disabled={this.props.loading}
            onClick={this.props.onCancel}
            type="button"
          >
            {gettext("Cancel")}
          </button>
          <div className="clearfix visible-xs-block" />
          <Protect
            canProtect={this.props.canProtect}
            disabled={this.props.loading}
            onProtect={this.props.onProtect}
            onUnprotect={this.props.onUnprotect}
            protect={this.props.protect}
          />
        </div>
        <AttachmentsEditor
          attachments={this.props.attachments}
          onAttachmentsChange={this.props.onAttachmentsChange}
          placeholder={this.props.placeholder}
          replaceSelection={this.replaceSelection}
        />
      </div>
    )
  }
}

export function Protect(props) {
  if (!props.canProtect) return null

  const label = props.protect ? gettext("Protected") : gettext("Protect")

  return (
    <button
      className="btn btn-icon btn-default btn-protect btn-sm pull-right"
      disabled={props.disabled}
      onClick={props.protect ? props.onUnprotect : props.onProtect}
      title={label}
      type="button"
    >
      <span className="material-icon">
        {props.protect ? "lock" : "lock_outline"}
      </span>
      <span className="btn-text hidden-md hidden-lg">{label}</span>
    </button>
  )
}
