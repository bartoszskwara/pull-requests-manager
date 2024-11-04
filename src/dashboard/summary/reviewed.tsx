import { SummaryCard } from "./summaryCard.tsx";
import { useDashboardContext } from "../context/DashboardContextProvider.tsx";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { fetchReviews, GithubPullRequest } from "../context/api.ts";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { PaperCard } from "./paperCard.tsx";
import uniq from "lodash/uniq";
import { PercentageProgress } from "./percentageProgress.tsx";

export const DATA_WITH_REVIEWS_LS = "PRMANAGER-DATAWITHREVIEWS";

type Review = {
  user: string;
  state: "APPROVED" | "COMMENTED" | "REJECTED"
}

export const Reviewed = () => {
  const { dataOfDifferentAuthors, owner, repo, apiKey, author } = useDashboardContext();
  const [reviewsByPR, setReviewsByPR] = useState<Record<number, Review[]>>(localStorage.getItem(DATA_WITH_REVIEWS_LS) ? JSON.parse(localStorage.getItem(DATA_WITH_REVIEWS_LS) || "{}") : {});
  const [loading, setLoading] = useState<boolean>(false);
  const [failedPrs, setFailedPrs] = useState<number[]>([]);
  const canFetch = useRef<boolean>(true);
  const otherPRs = dataOfDifferentAuthors
    .filter(({ user, state, merged_at }) => user.login !== "pro-bot" && (state !== "closed" || !!merged_at));

  const fetchReviewsData = async (items: Pick<GithubPullRequest, "number" | "user" | "state" | "merged_at">[], canFetch: MutableRefObject<boolean>) => {
    setLoading(true);
    setFailedPrs([]);
    for(const pr of items) {
      if (!canFetch.current) {
        break;
      }
      try {
        const reviews = await fetchReviews({ prNumber: pr.number, owner, repo, apiKey });
        const shortenReviews = reviews.data.map(({ user, state }) => ({ user: user.login, state }));
        setReviewsByPR((prev) => ({ ...prev, [pr.number]: shortenReviews }));
      } catch (error) {
        setFailedPrs((prev) => uniq([...prev, pr.number]));
        console.error(error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    canFetch.current = true;
    if (otherPRs.some(({ number }) => !reviewsByPR[number])) {
      setReviewsByPR({});
      fetchReviewsData(otherPRs, canFetch);
    }
    return () => {
      canFetch.current = false;
    };
  }, []);

  useEffect(() => {
    if (otherPRs.every(({ number }) => !!reviewsByPR[number])) {
      localStorage.setItem(DATA_WITH_REVIEWS_LS, JSON.stringify(reviewsByPR));
    }
  }, [reviewsByPR]);

  const total = otherPRs.length;
  const reviewed = otherPRs
    .filter(({ number }) => (reviewsByPR[number] ?? []).map(({ user }) => user).includes(author)).length;

  const handleRetry = () => {
    fetchReviewsData(otherPRs.filter(({ number }) => failedPrs.includes(number)), canFetch);
  };
  
  if (!otherPRs.length) {
    return (
      <SummaryCard
        valuePrimary="N/A"
        label="OF PRs REVIEWED"
      />
    );
  }

  if (loading || failedPrs.length) {
    const currentCount = Object.keys(reviewsByPR).length;
    const percentage = Math.round((currentCount / otherPRs.length) * 100);
    return (
      <PaperCard variant="outlined">
        {loading && <PercentageProgress value={percentage} />}
        {!!failedPrs.length && (
          <Button onClick={handleRetry}>TRY AGAIN</Button>
        )}
        <Typography variant="body1" color="textSecondary">OF PRs REVIEWED</Typography>
        <Typography variant="caption" color="textSecondary">{currentCount} / {otherPRs.length} FETCHED {failedPrs.length ? `(${failedPrs.length} failed)` : ""}</Typography>
      </PaperCard>
    );
  }

  return (
    <Tooltip
      slotProps={{
        tooltip: { sx: { maxWidth: 400 } }
      }}
      title={(
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Excluding Closed and pro-bot's PRs
        </Typography>
      )}
    >
      <Box sx={{ display: "flex" }}>
        <SummaryCard
          valuePrimary={total ? Math.round((reviewed / total) * 100) : "N/A"}
          valueSecondary="%"
          label="OF PRs REVIEWED"
        />
      </Box>
    </Tooltip>
  );
};
