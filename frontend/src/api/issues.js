import apiClient from "./client";

export const createIssue = async (issueData) => {
  const response = await apiClient.post("/issues", issueData);
  return response.data;
};
