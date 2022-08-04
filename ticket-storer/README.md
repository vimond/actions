# Ticket storer

The Ticket Storer should be triggered on each pushed commit, and stores each commit hash and related tickets in a DynamoDB table in Landlord. It gets the tickets for each commit by checking the commit message and any related PR bodies or issues.

The stored tickets are later used by the `ticket-checker` lambda in the deployment pipeline to assosiate relevant tickets to each deployment.