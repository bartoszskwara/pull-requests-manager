import { GithubComment } from "../context/api.ts";

type GetBugStatus = { comments: GithubComment[] };
export type BugStatus = "bugs" | "clean" | "unknown";

export const getPRBugStatus = ({ comments }: GetBugStatus): BugStatus => {
  const passedProBotComments = (comments ?? [])
    .filter(({ body, user }) => user.login === "pro-bot" && isPassed(body));
  const lastPassedComment = passedProBotComments.pop();

  return lastPassedComment ? getBugStatus(lastPassedComment) : "unknown";
};

const isPassed = (body: string) => {
  return body.includes("<th>Status</th><td>Passed");
};

const parseDefects = (body: string) => {
  const regex = /(\d+) open, (\d+) fixed, (\d+) discarded/;
  const match = body.match(regex);

  if (match) {
    return {
      open: parseInt(match[1], 10),
      fixed: parseInt(match[2], 10),
      discarded: parseInt(match[3], 10),
    };
  } else {
    return null;
  }
};

const getBugStatus = ({ body }: { body: string }) => {
  const defects = parseDefects(body);
  if (!defects) {
    return "clean";
  }
  const { open, fixed } = defects;
  if (fixed > 0 && open === 0) {
    return "bugs";
  } else if (fixed === 0 && open === 0) {
    return "clean";
  } else {
    return "unknown";
  }
};
