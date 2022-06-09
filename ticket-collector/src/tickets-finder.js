const ticketRegex = /[A-Z]{2,}-\d+/gm;

function findAllTickets(textBlocks) {
    let ticketsFound = new Set();
    for ( text of textBlocks) {
        const matches = [...text.matchAll(ticketRegex)];
        matches.forEach( m => {
            ticketsFound.add(m[0])
        })
        console.log(ticketsFound);
    }
    return ticketsFound;
}

module.exports = {
    findAll: findAllTickets
}