import createElementClass from 'create-element-class'

const lineTypes = {
  ' ': 'context',
  '+': 'addition',
  '-': 'removal'
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
      const chunkDiv = document.createElement('div')
      chunkDiv.className = 'chunk'
      for (let line of chunk.lines) {
        const lineDiv = document.createElement('div')
        lineDiv.className = 'line'
        if (line.type === 'addition') {
          lineDiv.style.backgroundColor = '#EAFFEA'
        } else if (line.type === 'removal') {
          lineDiv.style.backgroundColor = '#FFECEC'
        }
        lineDiv.textContent = line.text
        chunkDiv.appendChild(lineDiv)
      }

      this.container.appendChild(chunkDiv)
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
