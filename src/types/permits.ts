import { BigNumber } from "ethers";

export interface GenerateErc721PermitSignatureParams {
  organizationName: string;
  repositoryName: string;
  issueId: string;
  issueNumber: string;
  beneficiary: string;
  username: string;
  userId: string;
  contributionType: string;
  networkId: number;
}

export interface Erc721PermitSignatureData {
  beneficiary: string;
  deadline: BigNumber;
  keys: string[];
  nonce: BigNumber;
  values: string[];
}

export interface PermitTransactionData extends Erc20PermitTransactionData, Erc721PermitTransactionData {}

type PermitType = "erc20-permit" | "erc721-permit";

export interface Erc20PermitTransactionData {
  type: PermitType;
  permit: {
    permitted: {
      token: string;
      amount: string;
    };
    nonce: string;
    deadline: string;
  };
  transferDetails: {
    to: string;
    requestedAmount: string;
  };
  owner: string;
  signature: string;
  networkId: number;
}

export interface Erc721PermitTransactionData extends Erc20PermitTransactionData {
  nftMetadata: {
    GITHUB_ORGANIZATION_NAME: string;
    GITHUB_REPOSITORY_NAME: string;
    GITHUB_ISSUE_ID: string;
    GITHUB_USERNAME: string;
    GITHUB_CONTRIBUTION_TYPE: string;
  };
  request: {
    beneficiary: string;
    deadline: string;
    keys: string[];
    nonce: string;
    values: string[];
  };
}
