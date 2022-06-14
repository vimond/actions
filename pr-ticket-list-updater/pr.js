const m = (function () {
  return function (start, end) {
    const defaultStartMarker = "\n<!-- start: vimond pr ticket list -->\n";
    const defaultEndMarker = "\n<!-- end: vimond pr ticket list -->\n";

    if ((start !== undefined && end === undefined) || (start === undefined && end !== undefined)) {
      throw "Either set both start and end, or non of them";
    }
    let startMarker, endMarker;

    if (start !== undefined) {
      startMarker = start;
      endMarker = end;
    } else {
      startMarker = defaultStartMarker;
      endMarker = defaultEndMarker;
    }

    const pattern = new RegExp(`^(.*${startMarker}).*(${endMarker}.*)$`, "gs");

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


// const startMarker = "\n<!-- start: vimond pr ticket list -->\n";
// const endMarker = "\n<!-- end: vimond pr ticket list -->\n";
//
// // const startMarker = "\nAAA\n";
// // const endMarker = "BBB";
//
// const pattern = new RegExp(`^(.*)(${startMarker}.*${endMarker})(.*)$`, "gs");
//
//
// let test = async function() {
//   console.log(pattern);
//   const t = "something\\nelse" + startMarker + "# data to go away" + endMarker + "this should still be here";
//   // const t = "AAAfooBBB";
//   console.log(t);
//
//   const r = pattern.exec(t);
//   console.log(r[1]);
//   console.log(r[3]);
//   return true;
// }
// let wait = function (milliseconds) {
//   return new Promise((resolve) => {
//     if (typeof milliseconds !== 'number') {
//       throw new Error('milliseconds not a number');
//     }
//     setTimeout(() => resolve("done!"), milliseconds)
//   });
// };

module.exports = m;
