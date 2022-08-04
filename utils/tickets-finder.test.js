const ticketsFinder = require('./tickets-finder');

test('Find tickets', async () => {
    const inputs = [
        "fix(PLAT-567): something related to PLAT-890",
        "Test/test action get tickets",
        "## *What* does this PR do?\r\n\r\n> Add an explanation of what the code in this PR actually does:\r\n>\r\n> - Is there anything not straightforward in the code? Please explain it.\r\n\r\n## *Why* are you suggesting this change?\r\n\r\n> Add an explanation of why this PR should be considered\r\n\r\n## *Who* is the change affecting?\r\n\r\n> Add an explanation of whom this change will affect\r\n\r\n## *What* is affected by this change?\r\n\r\n> Add an explanation of what effect the change will have.\r\n \r\n## UI Changes :paintbrush:\r\n\r\n> If this PR introduces UI changes please add before & after screenshots.\r\n\r\n## API Changes \r\n\r\n> If this PR introduces API changes please add before & after curl examples.\r\n\r\n\r\n## JIRA Tickets\r\n\r\n> If this PR implements changes related to one or more JIRA tickets please:\r\n>\r\n> - Add the tickets ids in the title, e.g: SR-1234\r\n> - Add a link to each of the related tickets\r\n\r\n## Dependencies\r\n\r\n> Does this change depend on any other condition being met first before this can be merged?\r\n>\r\n> ",
        "fix: something\n\nPLAT-123",

    ]
    const tickets = Array.from(ticketsFinder.findAll(inputs));

    const expectedOutput = [ "PLAT-123", "PLAT-567", "PLAT-890", "SR-1234"]
    expect(tickets).toEqual(expect.arrayContaining(expectedOutput));
    expect(tickets.length).toEqual(expectedOutput.length);
});