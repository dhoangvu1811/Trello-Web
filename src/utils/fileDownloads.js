export const normalizeDownloadFileName = (fileName) => {
  const baseName = String(fileName || '')
    .split(/[\\/]/)
    .pop()
  const normalized = [...baseName]
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join('')
    .trim()

  return normalized || 'attachment'
}

export const saveBlobAsFile = (
  blob,
  fileName,
  {
    documentRef = document,
    urlApi = URL,
    schedule = setTimeout
  } = {}
) => {
  const objectUrl = urlApi.createObjectURL(blob)
  const anchor = documentRef.createElement('a')
  anchor.href = objectUrl
  anchor.download = normalizeDownloadFileName(fileName)
  anchor.style.display = 'none'
  documentRef.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  schedule(() => urlApi.revokeObjectURL(objectUrl), 0)
}
