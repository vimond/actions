# Ticket storer PR

The Ticket Storer PR runs after the `ticket-collector` and `pr-update-ticket-list` to store the tickets in a DynamoDB table in Landlord. The tickets in DynamoDB are updated if the PR is edited and the actions run as a result.


The stored tickets may later be used to retrieve tickets related to a PR assosiated with a commit.