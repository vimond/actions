const github = require('@actions/github')


const m = (function () {
  return function (start, end) {
    const defaultStartMarker = "\r\n<!-- start: vimond pr ticket list -->\r\n";
    const defaultEndMarker = "\r\n<!-- end: vimond pr ticket list -->\r\n";

    if ((start !== undefined && end === undefined) || (start === undefined && end !== undefined)) {
      throw "Either set both start and end, or none of them";
    }
    let startMarker, endMarker;

    if (start !== undefined) {
      startMarker = start;
      endMarker = end;
    } else {
      startMarker = defaultStartMarker;
      endMarker = defaultEndMarker;
    }

    const pattern =`^(.*)${startMarker}.*?${endMarker}(.*)$`;

    return {
      getStartMarker: function () {
        return startMarker
      },
      getEndMarker: function () {
        return endMarker
      },

      updatePr: async function(octokit, prId, tickets, repo) {
        const table = this.generateJiraTable(tickets)
        console.debug("Generated table:");
        console.debug(table);

        const thePr = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          pull_number: prId,
        })

        const newBody = this.replaceOrAddMarkedArea(thePr.data.body, table);
        if (thePr.data.body !== newBody) {
          console.log("Change in table detected, updating PR.")
          await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
            owner: repo.owner,
            repo: repo.repo,
            pull_number: prId,
            body: newBody,
          })
        } else {
          console.log("No changes in table.");
        }
      },

      hasMarkedArea: function (text) {
        return new RegExp(pattern, 'gs').test(text);
      },

      replaceOrAddMarkedArea: function(oldText, newText) {
        const matcher = new RegExp(pattern, 'gs');
        const match = matcher.exec(oldText);
        if(match === null || match.length !== 3) {
          return oldText + startMarker + newText + endMarker;
        } else {
          return match[1] + startMarker + newText + endMarker + match[2];
        }
      },

      generateJiraTable: function(issues) {
        const header = `
# Related JIRA Issues
<details>
  <summary>Expand to show</summary>
  
  | Issue | Description |
  | --- | --- |
        `.trim()
        const footer = `
</details>
        `.trim()
        let body = '';
        issues.forEach(issue => body += `  | [${issue.key}](${issue.link}) | ${issue.summary} |\r\n`);
        return header + '\r\n' + body + footer + '\r\n';
      },
    }
  }
})()


module.exports = m;
