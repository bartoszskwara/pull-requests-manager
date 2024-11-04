import axios from "axios";

type FetchPullsParams = {
    owner: string;
    repo: string;
    apiKey: string;
    page: number;
}

export type GithubLabel = {
    name: string;
    color: string;
};

export type GithubPullRequest = {
    number: number;
    title: string;
    created_at: string;
    html_url: string;
    merged_at: string;
    user: { login: string };
    state: "open" | "closed";
    base: { ref: string };
    labels: GithubLabel[];
    comments_url: string;
};

export const fetchPulls = ({ owner, repo, apiKey, page }: FetchPullsParams) => axios.get<GithubPullRequest[]>(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
  headers: {
    Authorization: `token ${apiKey}`,
    Accept: 'application/vnd.github.v3+json',
  },
  params: {
    state: 'all',
    per_page: 100,
    page
  },
});

type FetchCommentsParams = {
    apiKey: string;
    url: string;
}

export type GithubComment = any;

export const fetchComments = ({ url, apiKey }: FetchCommentsParams) => axios.get<GithubComment[]>(url, {
  headers: {
    Authorization: `token ${apiKey}`,
    Accept: 'application/vnd.github.v3+json',
  },
  params: {
    state: "all",
    per_page: 100,
    page: 1
  },
});

type FetchReviewsParams = {
    prNumber: number;
    owner: string;
    repo: string;
    apiKey: string;
}

export type GithubReview = { user: { login: string }, state: "APPROVED" | "COMMENTED" | "REJECTED" };

export const fetchReviews = ({ prNumber, owner, repo, apiKey }: FetchReviewsParams) => 
  axios.get<GithubReview[]>(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
    headers: {
      Authorization: `token ${apiKey}`,
      Accept: 'application/vnd.github.v3+json',
    }
  });
