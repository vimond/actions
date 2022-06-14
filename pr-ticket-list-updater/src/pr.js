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
        return match[1] + newText + match[2];
      }

//       getMarkdownTicketList: function (tickets) {
//         return `
// ${startMarker}
//   | Ticket | Description |
//   | --- | --- |
//   | foo | bar |
//   | quux | baz |
// ${endMarker}`.trim();
//       }
    };
  };
})();


module.exports = m;
