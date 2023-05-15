--________________ __________.____     ___________ _________
--\__    ___/  _  \\______   \    |    \_   _____//   _____/
--  |    | /  /_\  \|    |  _/    |     |    __)_ \_____  \ 
--  |    |/    |    \    |   \    |___  |        \/        \
--  |____|\____|__  /______  /_______ \/_______  /_______  /
--                \/       \/        \/        \/        \/ 

-- USERS
-- TEMP USER
-- LANGUAGES
-- FRIENDS
-- GOLF
-- PHASES
-- SUGGESTIONS
-- UPVOTE LANG
-- PROBLEM
-- NOTE PROBLEM
-- SOLUTIONS
-- COMMENTAIRE
-- ACTIVITY
-- UPVOTE COMMENTAIRE
-- CURRENT LANG
-- COLOR LANG

---------------
---- USERS ----
---------------
-- Description:
-- This table is the main table that corresponds to a user. Here are the information about a user (except the scores in the languages)
create table Users (
	-- INFOS
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, -- user id
    email VARCHAR(320) NOT NULL UNIQUE DEFAULT "", -- e-mail of the user
	email_date BIGINT UNSIGNED DEFAULT NULL, 
    bio TEXT, -- bio of the user
    pwd TEXT, -- password (encrypted) of the user
	pwd_date BIGINT UNSIGNED,
    username VARCHAR(24) NOT NULL UNIQUE,
	username_date BIGINT UNSIGNED,
	pfp VARCHAR(64), -- Link to the profile picture
	pp_date BIGINT UNSIGNED, -- Date of the profile picture last update
	banner VARCHAR(64), -- Link to the banner
	banner_date BIGINT UNSIGNED, -- Date of the banner last update
    country VARCHAR(2) DEFAULT "XX", -- Country
    country_date DATETIME DEFAULT "1970-01-01 00:00:00.000",
	vote_right TINYINT DEFAULT 1, -- If the user can vote for languages
	verified TINYINT DEFAULT 0, -- If the user if verified
	verification_code VARCHAR(6) DEFAULT "NaNNaN",  -- The verification code of the user
    admin TINYINT DEFAULT 0,

	-- SCORE
	golf_score INT UNSIGNED DEFAULT 1, -- Score in golf
	upgrade_score INT UNSIGNED DEFAULT 1, -- Score for upgrading answers
	coop_score INT UNSIGNED DEFAULT 1,  -- Score for cooperation


	-- EXTRA 
	---- GITHUB
    github VARCHAR(40) UNIQUE DEFAULT NULL, -- Github username
    github_id VARCHAR(32) UNIQUE DEFAULT NULL, -- Github ID
	---- DISCORD
	discord VARCHAR(37) UNIQUE DEFAULT NULL, -- 32 + 1 + 4 = 37
	discord_id VARCHAR(18) UNIQUE DEFAULT NULL, -- 18 is the length of discord Ids
	discord_date DATE DEFAULT NULL,
	discord_display TINYINT DEFAULT 0, -- If the display of the discord profile is on
	---- STACK
    stack VARCHAR(24) UNIQUE DEFAULT NULL, -- StackOverflow username
    stack_id VARCHAR(10) UNIQUE DEFAULT NULL, -- StackOverflow Id
	

	-- TOKEN
    token VARCHAR(64) UNIQUE -- User's token
);



-------------------
---- TEMP USER ----
-------------------
-- Description:
-- This table is the table containing the information of users who are not yet permanently registered on WeekGolf.
-- They have received a confirmation email but they have not verified it. After the verification of the account, the table concerning the temporary user is deleted.
-- The table is often reset.
CREATE TABLE TempUsers (
	code VARCHAR(6) NOT NULL, -- Secret code to validate account
	email VARCHAR(320) NOT NULL UNIQUE, -- Email
	pwd TEXT, -- Password of the user
	username VARCHAR(24) NOT NULL UNIQUE, -- Username
	country VARCHAR(2) DEFAULT "XX", -- Country
	created DATETIME -- When the account creation request was made.
);



------------------------
---- UserLanguages ----
------------------------
-- Description:
-- This table is a complementary table to Users so that it is not too unreadable.
-- This table keeps the score of each user in each language.
-- When a new language is added, the table is altered.
CREATE TABLE UserLanguages (
	apl_score INT UNSIGNED NOT NULL DEFAULT 0,
	bash_score INT UNSIGNED NOT NULL DEFAULT 0,
	bqn_score INT UNSIGNED NOT NULL DEFAULT 0,
	c_score INT UNSIGNED NOT NULL DEFAULT 0,
	clojure_score INT UNSIGNED NOT NULL DEFAULT 0,
	cpp_score INT UNSIGNED NOT NULL DEFAULT 0,
	cs_score INT UNSIGNED NOT NULL DEFAULT 0,
	elixir_score INT UNSIGNED NOT NULL DEFAULT 0,
	go_score INT UNSIGNED NOT NULL DEFAULT 0,
	golfscript_score INT UNSIGNED NOT NULL DEFAULT 0,
	haskell_score INT UNSIGNED NOT NULL DEFAULT 0,
	j_score INT UNSIGNED NOT NULL DEFAULT 0,
	java_score INT UNSIGNED NOT NULL DEFAULT 0,
	jelly_score INT UNSIGNED NOT NULL DEFAULT 0,
	julia_score INT UNSIGNED NOT NULL DEFAULT 0,
	k_score INT UNSIGNED NOT NULL DEFAULT 0,
	kotlin_score INT UNSIGNED NOT NULL DEFAULT 0,
	lua_score INT UNSIGNED NOT NULL DEFAULT 0,
	js_score INT UNSIGNED NOT NULL DEFAULT 0,
	ocaml_score INT UNSIGNED NOT NULL DEFAULT 0,
	perl_score INT UNSIGNED NOT NULL DEFAULT 0,
	php_score INT UNSIGNED NOT NULL DEFAULT 0,
	prolog_score INT UNSIGNED NOT NULL DEFAULT 0,
	python_score INT UNSIGNED NOT NULL DEFAULT 0,
	r_score INT UNSIGNED NOT NULL DEFAULT 0,
	raku_score INT UNSIGNED NOT NULL DEFAULT 0,
	ruby_score INT UNSIGNED NOT NULL DEFAULT 0,
	rust_score INT UNSIGNED NOT NULL DEFAULT 0,
	sass_score INT UNSIGNED NOT NULL DEFAULT 0,
	vyxal_score INT UNSIGNED NOT NULL DEFAULT 0,

	owner_id INT UNSIGNED NOT NULL,
	FOREIGN KEY (owner_id) REFERENCES Users(id)
);







-----------------
---- FRIENDS ----
-----------------
-- Description:
-- This table represents the friendship links between two users.
CREATE TABLE Friends (
	follower_id INT NOT NULL,
	following_id INT NOT NULL
);



--------------
---- Solutions ----
--------------
-- Description:
-- This table is one of the most important tables in WeekGolf. It represents the answers to a problem.
-- Although the name is not the most explicit, this table should not be confused with the Solution table which corresponds to the test cases
CREATE TABLE Solutions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE, -- ID of the Golf
    code TEXT, -- The code
    size INT, -- Size of the code (It is important to have this column, because there are some languages that are not in ASCII.)
    lang VARCHAR(16), -- The name of the lang
    owner_id INT UNSIGNED NOT NULL, -- The owner of this golf
    problem_id INT NOT NULL, -- The ID of the problem
	date_submit BIGINT UNSIGNED NOT NULL, -- The date of submission
	nb_players INT UNSIGNED DEFAULT 0, -- The number of players that there were
	rank INT UNSIGNED DEFAULT 0, -- The rank of this solution by languages

    FOREIGN KEY (owner_id) REFERENCES Users(id),
    FOREIGN KEY (problem_id) REFERENCES Problems(id)
);



-----------------
---- PHASES  ----
-----------------
-- Description:
-- This table represents the phase change dates so that there is a new language each month.
CREATE TABLE Phases (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE, -- ID of the phase
	phase1 DATETIME, -- Start of phase 1
	phase2 DATETIME, -- Start of phase 2
	phase3 DATETIME, -- Start of phase 3
	phase4 DATETIME, -- Start of phase 4
	phaseend DATETIME -- End of phase 4
);



--------------------
---- SUGGESTION ----
--------------------
-- Description:
-- The suggestion of a language to be added in WeekGolf. 
-- New suggestions can only be added during the first phase.
-- The category "upvote_final" corresponds to the number of votes in phase 3.
CREATE TABLE SuggestionLang (
	lang VARCHAR(16) NOT NULL, -- Name of the programming language
	phase_id INT UNSIGNED, -- The ID of the phase (That is, the number of languages that have been added before)
	owner_id INT UNSIGNED, -- The ID of the person who made this suggestion
	upvote INT UNSIGNED DEFAULT 0, -- The number of upvotes that this language has
	upvote_final INT UNSIGNED DEFAULT 0, -- The number of final upvotes that this language has

    FOREIGN KEY (phase_id) REFERENCES Phases(id)
);



---------------------
---- UPVOTE LANG ----
---------------------
-- Description:
-- This table is there to keep track of who has upvoted what language
CREATE TABLE UpvoteLang (
	lang VARCHAR(16) NOT NULL, -- Name of the lang 
	owner_id INT UNSIGNED NOT NULL, -- The ID of the person who upvoted
	phase_id INT UNSIGNED NOT NULL, -- The ID of the phase (That is, the number of languages that have been added before)
	final TINYINT DEFAULT 0, -- If it's a upvote_final or not. 0 if not final. 1 if yes. More info about upvote_final in the previous table

    FOREIGN KEY (phase_id) REFERENCES Phases(id)
);



-----------------
---- PROBLEM ----
-----------------
-- Description:
-- This table is also of great importance since it is the table that contains the problems (for once the name is explicit...)
CREATE TABLE Problems (
    id INT PRIMARY KEY AUTO_INCREMENT UNIQUE, -- ID of Problem (you can see them on https://week.golf/problems.html)
    title VARCHAR(64), -- Title of the problem
    descript TEXT, -- Description of the problem
	date_enable DATETIME, -- Date where the problem start
	date_end DATETIME, -- Date where the problem ends
	update_state TINYINT DEFAULT 0, -- 0 is not updated and 1 is updated
	show_case INT DEFAULT 7, -- Number of test case that are shown
	random_case INT DEFAULT 6, -- Number of "random"/hidden test case
	sum_votes INT DEFAULT 0, -- Sum of votes
	voters INT DEFAULT 0, -- Number of people who voted
	lotw VARCHAR(16) DEFAULT NULL -- Language Of The Week
);



----------------------
---- NOTE PROBLEM ----
----------------------
-- Description:
-- This table corresponds to the score that a user assigns to a problem
CREATE TABLE NoteProblem (
	note INT NOT NULL, -- The note given
	problem_id INT, -- To this problem
	owner_id INT UNSIGNED, -- By this user

    FOREIGN KEY (owner_id) REFERENCES Users(id),
    FOREIGN KEY (problem_id) REFERENCES Problems(id)
);



-------------------
---- VerifySolution ----
-------------------
-- Description:
-- Contrary to what one might think, this table does NOT correspond to the table of user solutions to a golf code problem.
-- This table corresponds to the information to validate a solution to a problem
CREATE TABLE VerifySolution (
    input TEXT NOT NULL, -- The input for a problem
    expected_output TEXT NOT NULL, -- The expected output from the program that is executed with input
    id_output INT NOT NULL, -- The ID of this ouput (Not unique because for every problem the id_output starts at 0)
    problem_id INT NOT NULL -- The ID of the problem
);



------------------
---- Comments ----
------------------
-- Description:
-- This table corresponds to the information of a comment
CREATE TABLE Comments (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE, -- ID of the comment
	content TEXT, -- Content of the comment
    owner_id INT UNSIGNED NOT NULL, -- Owner of this comment
	solution_id BIGINT UNSIGNED NOT NULL, -- On which solution it has been posted
	upvote INT UNSIGNED DEFAULT 0, -- Number of Upvotes that this comment has
	date_send DATETIME NOT NULL, -- When the comment was posted

    FOREIGN KEY (owner_id) REFERENCES Users(id),
    FOREIGN KEY (solution_id) REFERENCES Solutions(id)
);



------------------
---- ACTIVITY ----
------------------
-- Description:
-- This table corresponds to the events that occur on WeekGolf
CREATE TABLE Activity (
	id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE, -- ID of this activity
	title TEXT NOT NULL, -- Title of this activity
	content TEXT, -- Content of this activity
	bytes INT UNSIGNED,
	old_bytes INT UNSIGNED,
	old_user_id INT UNSIGNED,
	lang VARCHAR(16),
	problem_id INT,
	points INT UNSIGNED,

    owner_id INT UNSIGNED NOT NULL, -- To whom this activity belongs
	activity_date DATETIME NOT NULL, -- When did this activity occured
	major TINYINT DEFAULT 0, -- 0: No major  |  1: Golf  |  2: Upgrade

    FOREIGN KEY (old_user_id) REFERENCES Users(id),
    FOREIGN KEY (owner_id) REFERENCES Users(id),
    FOREIGN KEY (problem_id) REFERENCES Problems(id)
);




-----------------------------
---- UVPOTE COMMMENTAIRE ----
-----------------------------
-- Description:
-- This table is there to keep track of who has upvoted what comment
CREATE TABLE UpvoteComment (
	commentaire_id INT UNSIGNED NOT NULL, -- ID of the comment
	owner_id INT UNSIGNED NOT NULL, -- Who upvoted it

    FOREIGN KEY (owner_id) REFERENCES Users(id)
);



----------------------
---- CURRENT LANG ----
----------------------
-- Description:
-- Languages that are currently in WeekGolf
CREATE TABLE CurrentLang (
	lang VARCHAR(16) 
);
