import createElementClass from 'create-element-class'
import leven from 'leven'
import diff from 'fast-diff'

const lineTypes = {
  ' ': 'context',
  '+': 'addition',
  '-': 'removal'
}

const spanTypes = {
  ' ': 'span',
  '+': 'ins',
  '-': 'del'
}

export default createElementClass({
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.rendered) { this.updateRendering() }
  },

  connectedCallback() {
    // if (document.body.attachShadow) {
    //   this._shadowRoot = this.container.attachShadow({mode: 'open'})
    //   const style = document.createElement('style')
    //   style.type = 'text/css'
    //   style.appendChild(document.createTextNode(css))
    //   this._shadowRoot.appendChild(style)
    // }
    //
    // this.appendChild(this.container)
    //
    // this.input = this.querySelector('input')
    // this.input.className += ' shaf-screenreader-only'
    // this.updateRendering()

    const patch = this.textContent
    this.childNodes[0].remove()

    let lines = patch.split("\n")
    let oops = 0
    while (!isChunkHeader(lines[0])) { lines.shift() }

    const chunks = []
    for (let line of lines) {
      if (isChunkHeader(line)) {
        chunks.push({
          lines: []
        })
      } else if (lineTypes[line[0]]) {
        chunks[chunks.length - 1].lines.push({
          type: lineTypes[line[0]],
          text: line.substr(1)
        })
      }
    }
    if (document.body.attachShadow) {
      this.container = this.attachShadow({mode: 'open'})
    }

    for (let chunk of chunks) {
      chunk.lines.forEach((line, index, lines) => {
        if (line.type === 'removal') {
          const l = leven(line.text, lines[index + 1].text)
          if (l < 5) {
            line.hidden = true
            lines[index + 1].diff = diff(line.text, lines[index + 1].text)
          }
        }
      })
    }

    for (let chunk of chunks) {
      const chunkDiv = document.createElement('div')
      chunkDiv.className = 'chunk'
      for (let line of chunk.lines) {
        if (line.hidden) continue
        const blockDiv = document.createElement('div')
        blockDiv.className = 'line'

        let inlineElements = []
        if (line.diff) {
          line.diff.forEach((diffSection) => {
            let element
            if (diffSection[0] === diff.INSERT) {
              element = document.createElement('ins')
              element.style.backgroundColor = '#EAFFEA'
            } else if (diffSection[0] === diff.DELETE) {
              element = document.createElement('del')
              element.style.backgroundColor = '#FFECEC'
            } else {
              element = document.createElement('span')
            }
            element.textContent = diffSection[1]
            inlineElements.push(element)
          })
        } else if (line.type === 'addition') {
          inlineElements.push(document.createElement('ins'))
          inlineElements[0].style.backgroundColor = '#EAFFEA'
          inlineElements[0].textContent = line.text
        } else if (line.type === 'removal') {
          inlineElements.push(document.createElement('del'))
          inlineElements[0].style.backgroundColor = '#FFECEC'
          inlineElements[0].textContent = line.text
        } else {
          inlineElements.push(document.createElement('span'))
          inlineElements[0].textContent = line.text
        }
        inlineElements.forEach((inlineElement) => {
          blockDiv.appendChild(inlineElement)
        })
        chunkDiv.appendChild(blockDiv)
        chunkDiv.style.fontFamily = `Consolas, "Liberation Mono", Menlo, Courier, monospace;`
      }

      this.container.appendChild(chunkDiv)
      if (chunks[chunks.length - 1] !== chunk) {
        const hr = document.createElement('hr')
        this.container.appendChild(hr)
      }
    }

    // this.container.innerHTML = `<pre>${JSON.stringify(chunks, null, 2)}</pre>`

  },

  updateRendering() {
    // const root = this._shadowRoot || this.container
    // preact.render(<ToggleComponent input={this.input} />, root, root.querySelector(':not(style)'))
    this.rendered = true
  }
})

function isNotRemoval (line) {
  return line.type !== 'removal'
}

function isChunkHeader (str) {
  return str && str.indexOf('@@') === 0
}
