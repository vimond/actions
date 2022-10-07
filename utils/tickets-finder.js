const ticketRegex = /[A-Z]{2,}-\d+/gm;

function findAll(textBlocks) {
    console.log("findAll");
    console.log(textBlocks);
    let ticketsFound = new Set();
    for ( const text of textBlocks) {
        console.log(text);
        const matches = [...text.matchAll(ticketRegex)];
        matches.forEach( m => {
            ticketsFound.add(m[0]);
        })
    }
    return ticketsFound;
}

module.exports = {
    findAll
}
