/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/cognitive-complexity */

import Decimal from "decimal.js";
import { Context } from "../types/context";
import { getTokenSymbol } from "../utils/get-token-symbol";
import { getPayoutConfigByNetworkId } from "../utils/payout-by-network-id";

export async function simplePermitComment(context: Context) {
  const permit = context.config;
  const base64encodedClaimData = Buffer.from(JSON.stringify([permit])).toString("base64");

  if (permit.type === "erc721-permit") {
    const { nftMetadata, request } = permit;

    return "TODO";
  } else if (permit.type === "erc20-permit") {
    const { network_id, permit: reward } = permit;
    const { rpc } = getPayoutConfigByNetworkId(network_id);

    const tokenSymbol = await getTokenSymbol(reward.permitted.token, rpc);
    const tokenAmount = new Decimal(reward.permitted.amount);

    const contributorName = context.payload.sender.login;

    const claimUrl = new URL("http://localhost:8080/");
    claimUrl.searchParams.append("claim", base64encodedClaimData);

    return generateHtml({
      claimUrl,
      tokenAmount,
      tokenSymbol,
      contributorName,
    });
  }
}

function generateHtml({ claimUrl, tokenAmount, tokenSymbol, contributorName }: GenerateHtmlParams) {
  return `
  <details>
    <summary>
      <b
        ><h3>
          <a
            href="${claimUrl.toString()}"
          >
            [ ${tokenAmount} ${tokenSymbol} ]</a
          >
        </h3>
        <h6>@${contributorName}</h6></b
      >
    </summary>
  </details>
  `;
}

// function generateContributionsOverview(userScoreDetails: TotalsById, issue: GitHubIssue) {
//   const buffer = [
//     "<h6>Contributions Overview</h6>",
//     "<table><thead>",
//     "<tr><th>View</th><th>Contribution</th><th>Count</th><th>Reward</th>",
//     "</thead><tbody>",
//   ];

//   function newRow(view: string, contribution: string, count: string, reward: string) {
//     return `<tr><td>${view}</td><td>${contribution}</td><td>${count}</td><td>${reward}</td></tr>`;
//   }

//   for (const entries of Object.entries(userScoreDetails)) {
//     const userId = Number(entries[0]);
//     const userScore = entries[1];
//     for (const detail of userScore.details) {
//       const { specification, issueComments, reviewComments, task } = detail.scoring;

//       if (specification) {
//         buffer.push(
//           newRow(
//             "Issue",
//             "Specification",
//             Object.keys(specification.commentScores[userId].details).length.toString() || "-",
//             specification.commentScores[userId].totalScoreTotal.toString() || "-"
//           )
//         );
//       }
//       if (issueComments) {
//         buffer.push(
//           newRow(
//             "Issue",
//             "Comment",
//             Object.keys(issueComments.commentScores[userId].details).length.toString() || "-",
//             issueComments.commentScores[userId].totalScoreTotal.toString() || "-"
//           )
//         );
//       }
//       if (reviewComments) {
//         buffer.push(
//           newRow(
//             "Review",
//             "Comment",
//             Object.keys(reviewComments.commentScores[userId].details).length.toString() || "-",
//             reviewComments.commentScores[userId].totalScoreTotal.toString() || "-"
//           )
//         );
//       }
//       if (task) {
//         buffer.push(
//           newRow(
//             "Issue",
//             "Task",
//             // Converting the division to Number() to avoid trailing zeroes
//             issue.assignees.length === 0 ? "-" : `${Number((1 / issue.assignees.length).toFixed(2))}`,
//             task?.toString() || "-"
//           )
//         );
//       }
//     }
//   }
//   /**
//    * Example
//    *
//    * Contributions Overview
//    * | View | Contribution | Count | Reward |
//    * | --- | --- | --- | --- |
//    * | Issue | Specification | 1 | 1 |
//    * | Issue | Comment | 6 | 1 |
//    * | Review | Comment | 4 | 1 |
//    * | Review | Approval | 1 | 1 |
//    * | Review | Rejection | 3 | 1 |
//    */
//   buffer.push("</tbody></table>");
//   return buffer.join("\n");
// }

// function generateDetailsTable(totals: TotalsById) {
//   let tableRows = "";

//   for (const user of Object.values(totals)) {
//     for (const detail of user.details) {
//       const userId = detail.source.user.id;

//       const commentSources = [];
//       const specificationComments = detail.scoring.specification?.commentScores[userId].details;
//       const issueComments = detail.scoring.issueComments?.commentScores[userId].details;
//       const reviewComments = detail.scoring.reviewComments?.commentScores[userId].details;
//       if (specificationComments) commentSources.push(...Object.values(specificationComments));
//       if (issueComments) commentSources.push(...Object.values(issueComments));
//       if (reviewComments) commentSources.push(...Object.values(reviewComments));

//       const commentScores = [];
//       const specificationCommentScores = detail.scoring.specification?.commentScores[userId].details;
//       const issueCommentScores = detail.scoring.issueComments?.commentScores[userId].details;
//       const reviewCommentScores = detail.scoring.reviewComments?.commentScores[userId].details;
//       if (specificationCommentScores) commentScores.push(...Object.values(specificationCommentScores));
//       if (issueCommentScores) commentScores.push(...Object.values(issueCommentScores));
//       if (reviewCommentScores) commentScores.push(...Object.values(reviewCommentScores));

//       if (!commentSources) continue;
//       if (!commentScores) continue;

//       for (const index in commentSources) {
//         //
//         const commentSource = commentSources[index];
//         const commentScore = commentScores[index];

//         const commentUrl = commentSource.comment.html_url;
//         const truncatedBody = commentSource ? commentSource.comment.body.substring(0, 64).concat("...") : "";
//         const formatScoreDetails = commentScore.formatScoreCommentDetails;

//         let formatDetailsStr = "";
//         if (formatScoreDetails && Object.keys(formatScoreDetails).length > 0) {
//           const ymlElementScores = stringify(formatScoreDetails);
//           formatDetailsStr = ["", `<pre>${ymlElementScores}</pre>`, ""].join("\n"); // weird rendering quirk with pre that needs breaks
//         } else {
//           formatDetailsStr = "-";
//         }

//         const formatScore = zeroToHyphen(commentScore.wordScoreComment.plus(commentScore.formatScoreComment));
//         const relevanceScore = zeroToHyphen(commentScore.relevanceScoreComment);
//         const totalScore = zeroToHyphen(commentScore.totalScoreComment);
//         let formatScoreCell;
//         if (formatDetailsStr != "-") {
//           formatScoreCell = `<details><summary>${formatScore}</summary>${formatDetailsStr}</details>`;
//         } else {
//           formatScoreCell = formatScore;
//         }
//         tableRows += `<tr><td><h6><a href="${commentUrl}">${truncatedBody}</a></h6></td><td>${formatScoreCell}</td><td>${relevanceScore}</td><td>${totalScore}</td></tr>`;
//       }
//     }
//   }
//   if (tableRows === "") return "";
//   return `<h6>Conversation Incentives</h6><table><thead><tr><th>Comment</th><th>Formatting</th><th>Relevance</th><th>Reward</th></tr></thead><tbody>${tableRows}</tbody></table>`;
// }

// function zeroToHyphen(value: number | Decimal) {
//   if (value instanceof Decimal ? value.isZero() : value === 0) {
//     return "-";
//   } else {
//     return value.toString();
//   }
// }

interface GenerateHtmlParams {
  claimUrl: URL;
  tokenAmount: Decimal;
  tokenSymbol: string;
  contributorName: string;
  contributionsOverviewTable?: string;
  detailsTable?: string;
}
