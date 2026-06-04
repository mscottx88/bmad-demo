import { test, expect } from '@playwright/test';

/**
 * Deterministic seeding: pause autoplay, jump to a fixed step, force reduced
 * motion so streaming/transitions/particles resolve to stable states.
 * Steps: 0 intro · 1–5 phases · 6 climax · 7 cheat sheet.
 */
const seed = (step: number) => `/?paused=1&step=${step}&reducedMotion=1`;

test('intro — the wish (Diamond in the Rough)', async ({ page }) => {
  await page.goto(seed(0));
  await expect(page.getByTestId('wish-intro')).toBeVisible();
  await expect(page.getByTestId('genie')).toBeVisible();
  await expect(page).toHaveScreenshot('intro.png');
});

test('toolbar + progress are present', async ({ page }) => {
  await page.goto(seed(0));
  await expect(page.getByTestId('present-btn')).toBeVisible();
  await expect(page.getByTestId('mute-btn')).toBeVisible();
  await expect(page.getByTestId('cheat-toggle')).toBeVisible();
  await expect(page.getByTestId('progress')).toBeVisible();
});

test('planning phase — command + rendered doc + growing tree', async ({ page }) => {
  await page.goto(seed(3));
  await expect(page.getByTestId('workspace')).toHaveAttribute('data-phase', '3');
  await expect(page.getByTestId('terminal-command')).toHaveText('/bmad-create-architecture');
  await expect(page.getByTestId('code-editor')).toHaveAttribute('data-kind', 'doc');
  await expect(page.getByTestId('genie-speech')).toBeVisible();
  await expect(page.getByTestId('tree-file')).toHaveCount(3);
  await expect(page.getByTestId('vault-item')).toHaveCount(3);
  await expect(page).toHaveScreenshot('phase-3-architecture.png');
});

test('dev phase — diff code, multiple tabs, copy, cumulative tree', async ({ page }) => {
  await page.goto(seed(5));
  await expect(page.getByTestId('workspace')).toHaveAttribute('data-phase', '5');
  await expect(page.getByTestId('terminal-command')).toHaveText('/bmad-dev-story');

  const editor = page.getByTestId('code-editor');
  await expect(editor).toHaveAttribute('data-kind', 'code');
  await expect(editor).toHaveAttribute('data-diff', 'true');

  await expect(page.getByTestId('editor-tab')).toHaveCount(3);
  await expect(page.getByTestId('editor-code')).toContainText('rankByPantry');
  await expect(page.getByTestId('copy-button').first()).toBeVisible();
  await expect(page.getByTestId('tree-file')).toHaveCount(7);

  const term = page.getByTestId('terminal');
  const box = await term.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);

  await expect(page).toHaveScreenshot('dev-phase-code.png');
});

test('dev phase — switching tabs shows another file', async ({ page }) => {
  await page.goto(seed(5));
  await page.getByRole('tab', { name: /App\.tsx/ }).click();
  await expect(page.getByTestId('editor-code')).toContainText('PantryInput');
});

test('cheat sheet screen — final takeaway', async ({ page }) => {
  await page.goto(seed(7));
  await expect(page.getByTestId('cheat-screen')).toBeVisible();
  await expect(page.getByTestId('cheat-row')).toHaveCount(5);
  await expect(page.getByTestId('download-cheatsheet')).toBeVisible();
  await expect(page.getByTestId('cheat-screen')).toContainText('/bmad-prd');
  await expect(page).toHaveScreenshot('cheat-screen.png');
});

test('cheat sheet panel — opens from toolbar', async ({ page }) => {
  await page.goto(seed(0));
  await expect(page.getByTestId('cheat-panel')).toHaveCount(0);
  await page.getByTestId('cheat-toggle').click();
  await expect(page.getByTestId('cheat-panel')).toBeVisible();
  await expect(page.getByTestId('cheat-row')).toHaveCount(5);
});

test('climax — hush→erupt reveal with reward counter', async ({ page }) => {
  await page.goto(seed(6));
  await expect(page.getByTestId('reveal')).toBeVisible();
  await expect(page.getByTestId('app-mock')).toBeVisible();
  // Particles are motion-only → absent under reduced motion (snapshot-safe).
  await expect(page.getByTestId('particles')).toHaveCount(0);
  const counter = page.getByTestId('reward-counter');
  await expect(counter).toContainText('30');
  await expect(counter).toContainText('18');
  await expect(page).toHaveScreenshot('climax-reveal.png');
});

test('present mode — hides chrome; Esc restores', async ({ page }) => {
  await page.goto(seed(0));
  await page.getByTestId('present-btn').click();
  await expect(page.getByTestId('stage')).toHaveAttribute('data-present', 'true');
  await expect(page.getByTestId('toolbar')).toHaveCount(0);
  await expect(page.getByTestId('controls')).toHaveCount(0);
  await expect(page.getByTestId('present-hint')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('toolbar')).toBeVisible();
  await expect(page.getByTestId('controls')).toBeVisible();
});

test('present mode — via URL param', async ({ page }) => {
  await page.goto('/?paused=1&step=3&reducedMotion=1&present=1');
  await expect(page.getByTestId('stage')).toHaveAttribute('data-present', 'true');
  await expect(page.getByTestId('toolbar')).toHaveCount(0);
});

test('keyboard — arrow advances the ride', async ({ page }) => {
  await page.goto(seed(0));
  await expect(page.getByTestId('wish-intro')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('workspace')).toHaveAttribute('data-phase', '1');
});

test('mute toggle flips state', async ({ page }) => {
  await page.goto(seed(0));
  const mute = page.getByTestId('mute-btn');
  await expect(mute).toHaveAttribute('aria-pressed', 'false');
  await mute.click();
  await expect(mute).toHaveAttribute('aria-pressed', 'true');
});

test('controls — replay from the end resets the ride', async ({ page }) => {
  await page.goto(seed(7));
  await page.getByRole('button', { name: 'Replay' }).click();
  await expect(page.getByTestId('wish-intro')).toBeVisible();
});
