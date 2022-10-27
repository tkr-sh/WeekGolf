# Database
## Sumarry
- [Database](#database)
  - [Sumarry](#sumarry)
  - [Language used](#language-used)
  - [WeekGolf.sql](#weekgolfsql)
  - [Description of the tables](#description-of-the-tables)
    - [Users](#users)
    - [Temp User](#temp-user)
    - [Languages](#languages)
    - [Friends](#friends)
    - [Golf](#golf)
    - [Phases](#phases)
    - [Suggestion](#suggestion)
    - [Upvote Lang](#upvote-lang)
    - [Problem](#problem)
    - [Note Problem](#note-problem)
    - [Solutions](#solutions)
    - [Commentaire](#commentaire)
    - [Activity](#activity)
    - [Upvote Commentaire](#upvote-commentaire)
    - [Current Lang](#current-lang)
    - [Color Lang](#color-lang)

## Language used
The language used for this DataBase is SQL.<br>
The DBMS (DataBase Management System) is MySQL.

## WeekGolf.sql
WeekGolf.sql is the database behind WeekGolf.<br>
This file contains only the tables, not the table data.

## Description of the tables
### Users
This table is the main table that corresponds to a user. Here are the information about a user (except the scores in the languages)

### Temp User
This table is the table containing the information of users who are not yet permanently registered on WeekGolf.

They have received a confirmation email but they have not verified it. After the verification of the account, the table concerning the temporary user is deleted.

The table is often reset.

### Languages
This table is a complementary table to Users so that it is not too unreadable.
This table keeps the score of each user in each language.
When a new language is added, the table is altered.


### Friends
This table represents the friendship links between two users.

### Golf
This table is one of the most important tables in WeekGolf. It represents the answers to a problem.

Although the name is not the most explicit, this table should not be confused with the Solution table which corresponds to the test cases

### Phases
This table represents the phase change dates so that there is a new language each month.


### Suggestion
The suggestion of a language to be added in WeekGolf. 

New suggestions can only be added during the first phase.

The category "upvote_final" corresponds to the number of votes in phase 3.

### Upvote Lang
This table is there to keep track of who has upvoted what language

### Problem
This table is also of great importance since it is the table that contains the problems (for once the name is explicit...)

### Note Problem
This table corresponds to the score that a user assigns to a problem

### Solutions
Contrary to what one might think, this table does NOT correspond to the table of user solutions to a golf code problem.

This table corresponds to the information to validate a solution to a problem


### Commentaire
This table corresponds to the information of a comment
Commentaire <=> Comment :')


### Activity
This table corresponds to the events that occur on WeekGolf


### Upvote Commentaire
This table is there to keep track of who has upvoted what comment

### Current Lang
Languages that are currently in WeekGolf


### Color Lang
This table is there to associate to each language (whether supported by WeekGolf or not) a color.
