import gql from 'graphql-tag';
import createClient from 'lib/ghapi';
import { contribRepos } from 'lib/const';
import { oneLine } from 'common-tags';

const query = gql`
  query getContribWelcome($query: String!) {
    contrib_welcome: search(type: ISSUE, query: $query, first: 100) {
      issueCount
      results: edges {
        issue: node {
          ... on Issue {
            number
            updatedAt
            title
            url
            repository {
              name
            }
            labels(first: 100) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export default async (req, res) => {
  const client = createClient();
  const variables = {
    query: oneLine`${contribRepos.map((n) => `repo:${n}`).join('\n')}
      label:"contrib: welcome"
      is:open
      sort:updated-desc
      type:issues`,
  };
  const data = await client.query({
    query,
    variables,
  });
  res.json(data);
};
