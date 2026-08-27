export const REPO_URL = "https://github.com/TejasMehra/blastoise";
// The default branch is master, not main. `/tree/main/` is a 404.
export const ACTION_URL = `${REPO_URL}/tree/master/action`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const NEW_ISSUE_URL = `${REPO_URL}/issues/new`;

/**
 * The distribution is `pgblastoise`; the command and the import package are
 * both `blastoise`. The plain name belongs to an unrelated parquet library,
 * so anyone who types `pip install blastoise` gets the wrong package and no
 * error telling them so -- which is why the name is called out on the page
 * rather than left implicit in a copy button.
 */
export const PYPI_URL = "https://pypi.org/project/pgblastoise/";
export const PKG = "pgblastoise";

/** The corpus the classifier has been run over. */
export const CORPUS = {
  files: 3081,
  plainCreateIndex: 1875,
  concurrently: 121,
  projects: [
    "coder",
    "sourcegraph",
    "mattermost",
    "cal.com",
    "discourse",
    "zulip",
    "temporal",
  ],
  projectsTotal: 15,
};
