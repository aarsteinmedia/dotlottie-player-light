/* eslint-disable jsdoc/no-types */
import files from './files.js'

const previewForm = document.querySelector('form#preview'),
  pathSelect = previewForm.querySelector('select'),
  fallbackSVG = 'assets/am.lottie',
  regex = /\.(?:lottie|json)$/

previewForm?.addEventListener('submit', viewFile)
pathSelect?.addEventListener('change', viewFile)

const { length } = files.sort()

for (let i = 0; i < length; i++) {
  const opt = document.createElement('option')

  opt.innerText = files[i]
  opt.value = `/assets/${files[i].split(' ')[0]}`
  pathSelect.appendChild(opt)
}

handleRefresh()

function handleRefresh() {
  const selection = localStorage.getItem('selection')

  if (selection) {
    pathSelect.value = selection
    viewFile(selection)

    return
  }
  if (previewForm?.path?.value) {
    const { value } = previewForm.path

    path = value.includes('/')
      ? value
      : `assets/${value}${regex.test(value) ? '' : '.json'}`

    viewFile(path)

    return
  }

  const { search } = window.location

  if (!search) {
    viewFile(fallbackSVG)

    return
  }
  const searchParams = new URLSearchParams(search)

  if (searchParams.has('path') && previewForm.path) {
    previewForm.path.value = searchParams.get('path')

    const path = searchParams.get('path'),
      query = path.includes('/')
        ? path
        : `sandbox/svg-original/${path}${path.endsWith('.svg') ? '' : '.svg'}`

    viewFile(query)
  }
}

/**
 * View converted SVG.
 *
 * @param {SubmitEvent | Event | string} e - Either the submit event, the change event or the string value.
 */
async function viewFile(e) {
  let path

  if (e instanceof SubmitEvent) {
    e.preventDefault()
    const { value } = e.target.path

    path = value.includes('/')
      ? value
      : `assets/${value}${regex.test(value) ? '' : '.json'}`
  } else if (e instanceof Event) {
    path = e.target.value
    localStorage.setItem('selection', e.target.value)
  } else {
    path = e
  }

  /**
 * @type {import('./src/elements/DotLottiePlayer').default}
 */
  const dotLottie = document.querySelector('.preview')

  try {
    if (!dotLottie || !path || !path === '') {
      throw new Error('No placeholder')
    }

    await dotLottie.load(path)

    dotLottie.addEventListener('complete', () => console.debug('complete'))

  } catch (error) {
    console.error(error)
  }
}
