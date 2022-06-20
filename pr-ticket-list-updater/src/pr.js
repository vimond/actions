const m = (function () {
  return function (start, end) {
    const defaultStartMarker = "\n<!-- start: vimond pr ticket list -->\n";
    const defaultEndMarker = "\n<!-- end: vimond pr ticket list -->\n";

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

    const pattern = new RegExp(`^(.*${startMarker}).*?(${endMarker}.*)$`, "gs");

    return {
      getStartMarker: function () {
        return startMarker
      },
      getEndMarker: function () {
        return endMarker
      },

      hasMarkedArea: function (text) {
        return pattern.test(text)
      },

      replaceMarkedAreaWith: function(oldText, newText) {
        const match = pattern.exec(oldText);
        if(match === null || match.length !== 3) {
          return oldText;
        }
        return match[1] + newText + match[2];
      },

      generateJiraTable: function(issues) {
        const header = `
${startMarker}
# Related JIRA Issues
<details>
  <summary>Expand to show</summary>
  | Issue | Description |
  | --- | --- | 
        `.trim()
        const footer = `
</details>
${endMarker}
        `.trim()
        let body = '';
        for (const issue in issues) {
          body += `  | ${issue.id} | ${issue.title} |\n`
        }
        return header + body + footer;
      },
    }
  }
})()


module.exports = m;
