const ticketRegex = /[A-Z]{2,}-\d+/gm;

function findAll(textBlocks) {
    let ticketsFound = new Set();
    for ( const text of textBlocks) {
        const matches = [...text.matchAll(ticketRegex)];
        matches.forEach( m => {
            ticketsFound.add(m[0])
        })
    }
    return ticketsFound;
}

module.exports = {
    findAll
}