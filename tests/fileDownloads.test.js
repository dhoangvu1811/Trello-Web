import test from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeDownloadFileName,
  saveBlobAsFile
} from '../src/utils/fileDownloads.js'

test('preserves the attachment extension while removing unsafe path data', () => {
  assert.equal(
    normalizeDownloadFileName('C:\\fakepath\\release notes.pdf'),
    'release notes.pdf'
  )
  assert.equal(normalizeDownloadFileName('../../report.xlsx'), 'report.xlsx')
  assert.equal(normalizeDownloadFileName('\u0000'), 'attachment')
})

test('downloads a blob using the normalized original filename', () => {
  const events = []
  const anchor = {
    style: {},
    click: () => events.push('clicked'),
    remove: () => events.push('removed')
  }
  const documentRef = {
    createElement: (tagName) => {
      assert.equal(tagName, 'a')
      return anchor
    },
    body: {
      appendChild: (element) => {
        assert.equal(element, anchor)
        events.push('appended')
      }
    }
  }
  const urlApi = {
    createObjectURL: () => 'blob:attachment',
    revokeObjectURL: (url) => events.push(`revoked:${url}`)
  }

  saveBlobAsFile({}, '../release.zip', {
    documentRef,
    urlApi,
    schedule: (callback) => callback()
  })

  assert.equal(anchor.href, 'blob:attachment')
  assert.equal(anchor.download, 'release.zip')
  assert.deepEqual(events, [
    'appended',
    'clicked',
    'removed',
    'revoked:blob:attachment'
  ])
})
