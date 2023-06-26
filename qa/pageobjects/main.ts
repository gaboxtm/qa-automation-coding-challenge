import { Locator, Page } from "@playwright/test";

export class MainPage {
    readonly page: Page
    readonly title: Locator
    readonly inputUserName: Locator
    readonly buttonGo: Locator
    readonly loadingSpinner: Locator


    constructor(page: Page) {
        this.page = page
        this.title = page.getByRole('heading', { name: 'Get Github Repos' })
        this.inputUserName = page.getByLabel('Github Username')
        this.buttonGo = page.getByRole('button', { name: 'Go' })
        this.loadingSpinner = page.locator('div.circle')
    }

    static async new(page: Page) {
        return new MainPage(page);
    }

    async goto() {
        await this.page.goto('http://localhost:3000/')
    }

    async waitForSpinnerToFinish(){
        await this.loadingSpinner.waitFor({state: 'detached'})
    }

    async fillUserName(text: string) {
        await this.inputUserName.fill(text);
    }

    async getReposDisplayedContainer() {
        return this.page.locator('li.repo-row').all()
    }

    async getRepoNameFromContainer(container: Locator) {
        return await container.locator('a').textContent()
    }

    async getRepoDescriptionFromContainer(container: Locator) {
        return await container.locator('p.repo-description').textContent()
    }

    async getRepoUrlFromContainer(container: Locator) {
        return await container.locator('a').getAttribute('href')
    }

    async getReposDisplayedObject() {
        const reposContainer = await this.getReposDisplayedContainer();
        let repos: ReposResponse[] = [];
        for (const item of reposContainer) {
            const actualResponse: ReposResponse = {
                name: await this.getRepoNameFromContainer(item) || '',
                description: await this.getRepoDescriptionFromContainer(item) || '',
                url: await this.getRepoUrlFromContainer(item) || ''
            }
            repos.push(actualResponse)
        }
        return repos
    }

    async getResponseMessageElement() {
        return this.page.locator('section.message-area');
    }

    async getRepoAmountElement() {
        return this.page.locator('.repo-amount')
    }

    async getNoReposElement() {
        return this.page.getByText('No repos')
    }

    async clickRepoLinkByName(repoName: string) {
        await this.page.getByRole('link', { name: repoName }).click()
    }
}