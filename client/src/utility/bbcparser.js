const regex = {
   tokens: /(\[\/?.+?\])/i,
   isClosing: /\[\/[i u b]|quote\]/i,
   isOpen: /\[([i u b]|quote)\]/i,
   isQuote: /\[quote\s*?=?.+?\]/i
}

const lastInStack = stack => stack.slice(-1)[0]

const parse = input => {
   const startElem = document.createElement('div')
   startElem.classList.add('comment')
   const stack = [startElem]
   const tokens = input.split(regex.tokens)
   let elem;


   while (tokens.length) {
      let current = tokens.shift()
      if (regex.isQuote.test(current)) {
         const attrs = current.split('=')
         elem = document.createElement('blockquote')
         if(attrs[1]) {
            const name = attrs[1].slice(0, -1)
            const nametag = document.createElement('strong')
            nametag.textContent = name.trim() + ' said: '
            nametag.classList.add('said')
            elem.appendChild(nametag)
            elem.setAttribute('name', name)

         }
         lastInStack(stack).appendChild(elem)
         stack.push(elem)
      }
      else if (regex.isOpen.test(current)) {
         let tag = current.slice(1, -1)
         if (tag === 'quote') {
            tag = 'blockquote'
         }
         elem = document.createElement(tag)
         lastInStack(stack).appendChild(elem)
         stack.push(elem)
      }

      else if (regex.isClosing.test(current)) {
         stack.pop()
      }

      else {
         const textElem = document.createTextNode(current)
         lastInStack(stack).appendChild(textElem)
      }
   }

   return {__html: startElem.outerHTML}
}

export default parse