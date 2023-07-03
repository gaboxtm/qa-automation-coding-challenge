import { Page } from "@playwright/test";
import { ReposResponse } from "../types/repos-response.type";

export async function getUserRepos(page: Page, user: string): Promise<ReposResponse[]> {
    const apiReposResponse = (await page.evaluate(async (user) => {
        const response = await fetch(`https://api.github.com/users/${user}/repos`);
        const data = await response.json();
        return data;
    }, user)).map(item => {
        return {
            name: item.name,
            description: item.description ? item.description : '–',
            url: item.html_url
        }
    });

    return apiReposResponse
}