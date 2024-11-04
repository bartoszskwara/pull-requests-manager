import { useState } from "react";
import { SearchParams } from "../requestForm.tsx";
import { fetchComments, GithubComment, GithubLabel, GithubPullRequest } from "../context/api.ts";
import { getAllPullRequests } from "./getAllPullRequests.ts";
import { BugStatus, getPRBugStatus } from "./getPRBugStatus.ts";
import { uniq } from "lodash";
import { DATA_WITH_REVIEWS_LS } from "../summary/reviewed.tsx";

const DATA_LS = "PRMANAGER-DATA";
const DATA_DIFFERENT_AUTHORS_LS = "PRMANAGER-DATADIFFERENTAUTHORS";
const AVAILABLE_AUTHORS_LS = "PRMANAGER-AVAILABLEAUTHORS";

export type PullRequest = {
    number: number;
    title: string;
    url: string;
    mergedAt: string;
    createdAt: string;
    comments: GithubComment[];
    bugStatus: BugStatus;
    labels: GithubLabel[];
    state: string;
    base: string;
}

type UsePrsReturn = {
    data: PullRequest[];
    loading: boolean;
    fetchPullRequests: (params: SearchParams) => void;
    availableAuthors: string[];
    dataOfDifferentAuthors: Pick<GithubPullRequest, "number" | "user" | "state" | "merged_at">[];
}

export const usePrs = (): UsePrsReturn => {
  const [data, setData] = useState<PullRequest[]>(localStorage.getItem(DATA_LS) ? JSON.parse(localStorage.getItem(DATA_LS) || "[]") as PullRequest[] : []);
  const [dataOfDifferentAuthors, setDataOfDifferentAuthors] = useState<Pick<GithubPullRequest, "number" | "user" | "state" | "merged_at">[]>(localStorage.getItem(DATA_DIFFERENT_AUTHORS_LS) ? JSON.parse(localStorage.getItem(DATA_DIFFERENT_AUTHORS_LS) || "[]") : []);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>(localStorage.getItem(AVAILABLE_AUTHORS_LS) ? JSON.parse(localStorage.getItem(AVAILABLE_AUTHORS_LS) || "") as string[] : []);
  const [loading, setLoading] = useState(false);

  const saveAvailableAuthors = (items: GithubPullRequest[]) => {
    const authors = uniq(items.map(({ user }) => user.login));
    localStorage.setItem(AVAILABLE_AUTHORS_LS, JSON.stringify(authors));
    setAvailableAuthors(authors);
  };

  const saveDifferentAuthorsPRs = (items: GithubPullRequest[], author: string) => {
    const prsOfDifferentAuthors = items
      .filter((pr) => pr.user.login !== author)
      .map(({ number, user, state, merged_at }) => ({ number, user: { login: user.login }, state, merged_at }));
    localStorage.setItem(DATA_DIFFERENT_AUTHORS_LS, JSON.stringify(prsOfDifferentAuthors));
    setDataOfDifferentAuthors(prsOfDifferentAuthors);
  };

  const fetchPullRequests = async (params: SearchParams) => {
    if (isInvalid(params)) {
      return;
    }
    setLoading(true);
    localStorage.setItem(DATA_LS, "");
    localStorage.setItem(DATA_DIFFERENT_AUTHORS_LS, "");
    localStorage.setItem(AVAILABLE_AUTHORS_LS, "");
    localStorage.setItem(DATA_WITH_REVIEWS_LS, "");

    const allPullRequests = await getAllPullRequests(params);
    saveAvailableAuthors(allPullRequests);

    const allPullRequestsOfAuthor = allPullRequests.filter((pr) => pr.user.login === params.author);
    const { apiKey } = params;
    const prsOfAuthorWithComments = allPullRequestsOfAuthor
      .map(async (pr) => {
        const comments = await fetchComments({ url: pr.comments_url, apiKey });
        const { number, title, html_url: url, created_at: createdAt, merged_at: mergedAt, labels, state, base } = pr;
        const bugStatus = getPRBugStatus({ comments: comments.data });
        return {
          number,
          title,
          url,
          mergedAt,
          createdAt,
          comments: comments.data,
          bugStatus,
          labels,
          state,
          base: base.ref
        };
      });
    saveDifferentAuthorsPRs(allPullRequests, params.author);
    
    Promise.all(prsOfAuthorWithComments).then((response) => {
      setData(response);
      localStorage.setItem(DATA_LS, JSON.stringify(response));
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    });
  };

  return { fetchPullRequests, data, loading, availableAuthors, dataOfDifferentAuthors };
};

const isInvalid = ({ apiKey, author, startDate, endDate, repo, owner }: SearchParams) => 
  !apiKey || !author || !startDate || !endDate || !repo || !owner || isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime());
