import { fetchPulls, GithubPullRequest } from "../context/api.ts";
import { SearchParams } from "../requestForm.tsx";

export const getAllPullRequests = async ({ apiKey, startDate, endDate, repo, owner }: SearchParams): Promise<GithubPullRequest[]> => {
  const from = new Date(startDate);
  const to = new Date(endDate);

  let page = 1;
  let allPullRequests = [] as GithubPullRequest[];
  while (true) {
    const response = await fetchPulls({ apiKey, repo, owner, page });
    if (response.data.length === 0) {
      break;
    }

    allPullRequests = [...allPullRequests, ...response.data];

    const isLastPRBeforeStartDate = new Date(response.data[response.data.length - 1]?.created_at) < from;
    if (isLastPRBeforeStartDate) {
      break;
    }

    page++;
  }
  return allPullRequests.filter(({ created_at }) => new Date(created_at) >= from && new Date(created_at) <= to);
};
