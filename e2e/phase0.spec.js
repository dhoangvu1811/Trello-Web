import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const apiDirectory = path.resolve(currentDirectory, '../../Trello-Api')
const boardId = '700000000000000000000010'
const backlogId = '700000000000000000000020'
const doneId = '700000000000000000000021'
const cardId = '700000000000000000000030'

const seed = () => {
  execFileSync(
    process.execPath,
    [path.join(apiDirectory, 'tests/phase0E2eSeed.js')],
    {
      cwd: apiDirectory,
      env: {
        ...process.env,
        MONGODB_TEST_DATABASE:
          process.env.MONGODB_TEST_DATABASE || 'trello_phase0_test_playwright'
      },
      stdio: 'inherit'
    }
  )
}

const cleanup = () => {
  execFileSync(
    process.execPath,
    [path.join(apiDirectory, 'tests/phase0E2eSeed.js'), '--cleanup'],
    {
      cwd: apiDirectory,
      env: {
        ...process.env,
        MONGODB_TEST_DATABASE:
          process.env.MONGODB_TEST_DATABASE || 'trello_phase0_test_playwright'
      },
      stdio: 'inherit'
    }
  )
}

const login = async (page, email) => {
  await page.goto('/login')
  await page.getByLabel('Enter Email...').fill(email)
  await page.getByLabel('Enter Password...').fill('Phase0Test1!')
  await Promise.all([
    page.waitForURL('**/boards'),
    page.getByRole('button', { name: 'Login' }).click()
  ])
}

test.beforeEach(seed)
test.afterAll(cleanup)

test('owner can log in, move a card, invite a viewer, and inspect activity', async ({ page }) => {
  await login(page, 'owner@phase0.test')
  const persistedState = await page.evaluate(() =>
    Object.values(localStorage).join(' ')
  )
  expect(persistedState).not.toContain('accessToken')
  expect(persistedState).not.toContain('refreshToken')
  await expect(page.getByText('Phase Zero E2E Board')).toBeVisible()
  await page.getByRole('link', { name: 'Go to board' }).click()
  await expect(page).toHaveURL(`/boards/${boardId}`)

  const card = page.getByTestId(`card-${cardId}`)
  const targetColumn = page.getByTestId(`column-${doneId}`)
  const moveResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/boards/supports/moving_card') &&
      response.status() === 200
  )
  const cardBox = await card.boundingBox()
  const targetBox = await targetColumn.boundingBox()
  if (!cardBox || !targetBox) throw new Error('Drag targets are not visible.')
  await page.mouse.move(
    cardBox.x + cardBox.width / 2,
    cardBox.y + cardBox.height / 2
  )
  await page.mouse.down()
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 12 }
  )
  await page.mouse.up()
  await moveResponse
  await expect(targetColumn.getByTestId(`card-${cardId}`)).toBeVisible()

  await page.getByRole('button', { name: 'Invite' }).click()
  await page.getByLabel('Enter email to invite...').fill('invitee@phase0.test')
  await page.getByRole('combobox', { name: /Board role/ }).click()
  await page.getByRole('option', { name: 'Viewer' }).click()
  const inviteResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith('/invitations/board') && response.status() === 201
  )
  await page.getByRole('button', { name: 'Invite', exact: true }).last().click()
  await inviteResponse

  await page.getByRole('button', { name: 'Activity' }).click()
  await expect(page.getByText('moved a card')).toBeVisible()
  await expect(page.getByText('invited a board member')).toBeVisible()
})

test('logs out locally and returns to login', async ({ page }) => {
  await login(page, 'owner@phase0.test')
  await page.getByRole('button', { name: 'Account settings' }).click()
  await page.getByRole('menuitem', { name: 'Logout' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page).toHaveURL('/login')
})

test('synchronizes board changes between two active users without reloading', async ({ browser }) => {
  const ownerContext = await browser.newContext()
  const viewerContext = await browser.newContext()
  const ownerPage = await ownerContext.newPage()
  const viewerPage = await viewerContext.newPage()

  try {
    await Promise.all([
      login(ownerPage, 'owner@phase0.test'),
      login(viewerPage, 'viewer@phase0.test')
    ])
    await Promise.all([
      ownerPage.goto(`/boards/${boardId}`),
      viewerPage.goto(`/boards/${boardId}`)
    ])

    const ownerCard = ownerPage.getByTestId(`card-${cardId}`)
    const ownerTargetColumn = ownerPage.getByTestId(`column-${doneId}`)
    await expect(
      viewerPage.getByTestId(`column-${backlogId}`).getByTestId(`card-${cardId}`)
    ).toBeVisible()

    const moveResponse = ownerPage.waitForResponse(
      (response) =>
        response.url().includes('/boards/supports/moving_card') &&
        response.status() === 200
    )
    const cardBox = await ownerCard.boundingBox()
    const targetBox = await ownerTargetColumn.boundingBox()
    if (!cardBox || !targetBox) throw new Error('Drag targets are not visible.')
    await ownerPage.mouse.move(
      cardBox.x + cardBox.width / 2,
      cardBox.y + cardBox.height / 2
    )
    await ownerPage.mouse.down()
    await ownerPage.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 12 }
    )
    await ownerPage.mouse.up()
    await moveResponse

    await expect(
      viewerPage.getByTestId(`column-${doneId}`).getByTestId(`card-${cardId}`)
    ).toBeVisible()
  } finally {
    await ownerContext.close()
    await viewerContext.close()
  }
})

test('viewer sees the board but cannot mutate or drag its content', async ({ page }) => {
  await login(page, 'viewer@phase0.test')
  await page.goto(`/boards/${boardId}`)
  await expect(page.getByTestId(`column-${backlogId}`)).toBeVisible()
  await expect(page.getByTestId(`card-${cardId}`)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Invite' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Add new column' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Add new card' })).toHaveCount(0)

  const updateRequests = []
  page.on('request', (request) => {
    if (['POST', 'PUT', 'DELETE'].includes(request.method())) {
      updateRequests.push(request.url())
    }
  })
  const card = page.getByTestId(`card-${cardId}`)
  const done = page.getByTestId(`column-${doneId}`)
  const cardBox = await card.boundingBox()
  const doneBox = await done.boundingBox()
  if (!cardBox || !doneBox) throw new Error('Viewer drag targets are not visible.')
  await page.mouse.move(cardBox.x + 10, cardBox.y + 10)
  await page.mouse.down()
  await page.mouse.move(doneBox.x + 20, doneBox.y + 20, { steps: 8 })
  await page.mouse.up()
  expect(updateRequests).toEqual([])
  await expect(page.getByTestId(`column-${backlogId}`).getByTestId(`card-${cardId}`)).toBeVisible()
})
