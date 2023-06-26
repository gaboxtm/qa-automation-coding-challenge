import { test, expect, chromium } from '@playwright/test';
import { MainPage } from '../pageobjects/main';
import { getUserRepos } from '../apicalls/getUserRepos';


test.describe('Critical Path Scenarios', () => {
    let mainPage: MainPage;
    test.beforeEach(async ({ page }) => {
        mainPage = await MainPage.new(page)
    })

    test('Positive Scenario - Enter a valid github username and click `Go` button', async ({ page }) => {
        const user = 'gaboxtm'
        const apiReposResponse: ReposResponse[] = await getUserRepos(page, user)
        await mainPage.goto()
        await mainPage.fillUserName(user)
        await mainPage.buttonGo.click()
        await mainPage.waitForSpinnerToFinish()
        expect(await mainPage.getResponseMessageElement()).toContainText('Success')
        expect(await mainPage.getRepoAmountElement()).toHaveText(`Found ${apiReposResponse.length} Repos`)
        expect(await mainPage.getReposDisplayedContainer()).toHaveLength(apiReposResponse.length)
        expect(await mainPage.getReposDisplayedObject()).toEqual(apiReposResponse)
        await mainPage.clickRepoLinkByName(apiReposResponse[0].name)
        await page.waitForEvent('popup')
        const tabs = page.context().pages()
        await expect(tabs[1]).toHaveURL(apiReposResponse[0].url);
    })

    test('Positive Scenario - Enter a valid github username and press `Enter` Key', async ({ page }) => {
        const user = 'tnass'
        const apiReposResponse = await getUserRepos(page, user)
        await mainPage.goto()
        await mainPage.fillUserName(user)
        await page.keyboard.press('Enter')
        await mainPage.waitForSpinnerToFinish()
        expect(await mainPage.getResponseMessageElement()).toContainText('Success')
        expect(await mainPage.getRepoAmountElement()).toHaveText(`Found ${apiReposResponse.length} Repos`)
        expect(await mainPage.getReposDisplayedContainer()).toHaveLength(apiReposResponse.length)
        expect(await mainPage.getReposDisplayedObject()).toEqual(apiReposResponse)
        await mainPage.clickRepoLinkByName(apiReposResponse[0].name)
        await page.waitForEvent('popup')
        const tabs = page.context().pages()
        await expect(tabs[1]).toHaveURL(apiReposResponse[0].url);
    })

    test('Negative Scenario - Empty username provided and click "Go" button', async ({ page }) => {
        await mainPage.goto()
        await mainPage.fillUserName('')
        await mainPage.buttonGo.click()
        await mainPage.waitForSpinnerToFinish()
        expect(await mainPage.getResponseMessageElement()).toHaveText('Github user not found')
        await expect(await mainPage.getNoReposElement()).toBeVisible()
        expect(await mainPage.getReposDisplayedContainer()).toHaveLength(0)
        expect(await mainPage.getReposDisplayedObject()).toEqual([])
    })

    test('Negative Scenario - Turn internet off before clicking "Go" button', async ({page}) => {
        await page.close()
        const user = 'gaboxtm'
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const newPage = await context.newPage();
        const newMainPage = await MainPage.new(newPage)
        await newMainPage.goto()
        await context.setOffline(true);
        await newMainPage.fillUserName(user)
        await newMainPage.buttonGo.click()
        await expect(await newMainPage.getResponseMessageElement()).toHaveText('Something went wrong')
    })
})