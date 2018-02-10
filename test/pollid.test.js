import test from 'ava'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'

const testData = {
  "polls": [{
      "id": 1,
      "title": "Is bitcoin worth the time and money that mining requires?",
      "publishedDate": 1516605447,
      "answer": {
        "type": "Single",
        "options": [{
            "id": 1,
            "label": "Yes"
          },
          {
            "id": 2,
            "label": "No"
          }
        ]
      }
    },
    {
      "id": 2,
      "title": "Should chatbots replace humans in customer service jobs?",
      "publishedDate": 1516000647,
      "answer": {
        "type": "Single",
        "options": [{
            "id": 3,
            "label": "Yes"
          },
          {
            "id": 4,
            "label": "No"
          }
        ]
      }
    },
    {
      "id": 3,
      "title": "How are we feeling about 2018?",
      "publishedDate": 1515568647,
      "answer": {
        "type": "Single",
        "options": [{
            "id": 5,
            "label": "Hopeful"
          },
          {
            "id": 6,
            "label": "Doubtful"
          }
        ]
      }
    },
    {
      "id": 4,
      "title": "Which country/region have you ever visited? (Select all that applies)",
      "publishedDate": 1515482247,
      "answer": {
        "type": "Multi",
        "options": [{
            "id": 7,
            "label": "Hong Kong"
          },
          {
            "id": 8,
            "label": "China"
          },
          {
            "id": 9,
            "label": "Australia"
          },
          {
            "id": 10,
            "label": "Thailand"
          },
          {
            "id": 11,
            "label": "Korea"
          },
          {
            "id": 12,
            "label": "Japan"
          }
        ]
      }
    },
    {
      "id": 5,
      "title": "Will new benefits encourage you to study or work in mainland?",
      "publishedDate": 1515309447,
      "answer": {
        "type": "Single",
        "options": [{
            "id": 13,
            "label": "Yes"
          },
          {
            "id": 14,
            "label": "No"
          }
        ]
      }
    }
  ]
}


// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null

// Init Nuxt.js and start listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '..')
  let config = {}
  try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
  config.rootDir = rootDir // project folder
  config.dev = false // production build
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  nuxt.listen(4000, 'localhost')
})

// html exists
test.todo('html renders')

// five polls show up on front page
test.todo('title of each poll shows up on page')

// css tests
test.todo('buttons text and titles are appropriate colors')

// snapshot
test.skip('renders as before', async t => {
	let context = {}
  const { html } = await nuxt.renderRoute('/1/', context)
  // const tree = html;
	t.snapshot(html);
});

// Example of testing only generated html
test('Route / exits and render HTML', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/1/', context)
  t.true(html.includes(`<h1 class="title">Today's poll</h1>`))
  t.true(html.includes('<h2 class="subtitle">Is bitcoin worth the time and money that mining requires?</h2>'))
})

// Example of testing via DOM checking
test.skip('Route / exits and render HTML with CSS applied', async t => {
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/1')
  const element = window.document.querySelector('.red')
  t.not(element, null)
  t.is(element.textContent, 'Hello world!')
  t.is(element.className, 'red')
  t.is(window.getComputedStyle(element).color, 'red')
})

// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
