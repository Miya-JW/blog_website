-- Your database initialisation SQL here
drop table if exists likes;
drop table if exists comments;
drop table if exists articles;
drop table if exists users;

create table if not exists users
(
    user_id       int          not null auto_increment primary key,
    userName      varchar(30)  not null,
    password      varchar(100) not null,
    real_name     varchar(30),
    date_of_birth varchar(30),
    description   text,
    avatar        varchar(50)
);

insert into users(user_id, userName, password, real_name, date_of_birth, description, avatar)
VALUES (8001, 'batman', '$2b$10$A46OLBR4RizWF.sZiGuCC.KhuaSCjK0OH4Y.WYbm4Rw8SlSdFupnG', 'Bruce Wayne', '1985-02-19',
        ' I am Batman, the Dark Knight of Gotham. Behind the mask is Bruce Wayne, a businessman by day, but by night, I stand as a symbol of justice, fighting against the corruption and crime that plague my city.',
        'avatar15'),
       (8002, 'captain_america', '$2b$10$A46OLBR4RizWF.sZiGuCC.KhuaSCjK0OH4Y.WYbm4Rw8SlSdFupnG', 'Steve Rogers',
        '1918-07-04',
        'Hello, I''m Steve Rogers, also known as Captain America. I was just a kid from Brooklyn until I joined the army during World War II and was chosen for the Super Soldier program. Now, I fight to protect the innocent and uphold justice, always standing for freedom and the American way.',
        'avatar14'),
       (8003, 'iron_man', '$2b$10$A46OLBR4RizWF.sZiGuCC.KhuaSCjK0OH4Y.WYbm4Rw8SlSdFupnG', 'Tony Stark', '1985-05-29',
        'Hi, I''m Tony Stark, better known to the world as Iron Man. You might also know me as the genius billionaire inventor who''s leading Stark Industries. I don''t just play with cutting-edge technology; I create it. When I''m not running my company or tinkering with a new piece of tech, I''m suited up in one of my Iron Man armors, fighting to protect the world from threats of any size.',
        'avatar13');


create table if not exists articles
(
    articleId int          not null primary key auto_increment,
    title     varchar(100) not null,
    date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content   text         not null,
    image varchar(50),
    likes     int,
    author_id int          not null,
    foreign key (author_id) references users (user_id)
);



insert into articles(articleId, title, date, content, author_id)
VALUES (1001, 'The Values We Stand For', default, 'Hello, citizens. This is Steve Rogers, but many of you know me as Captain America. As I stand here today, I''m reminded of the journey we''ve all embarked on to protect the ideals this great nation was built upon. It''s not just about the battles fought on the front lines, but also about the daily struggles and triumphs of the American people.

Throughout my life, I''ve seen incredible changes and challenges. From the dark days of World War II to the complexities of the modern world, the essence of what makes us who we are remains the same – it''s our spirit, our resilience, and our unwavering commitment to freedom and justice.

I''ve always believed in the power of standing up for what''s right, even when it''s not the easy path. It''s about doing the small things with great love and courage. It''s about lending a hand to our neighbor, standing up against injustice, and believing in the potential of each individual to make a difference.

As we move forward, let''s not forget the sacrifices of those who came before us. Their courage and dedication paved the way for the freedoms we enjoy today. It''s our responsibility to carry on their legacy and to continue fighting for a better, more just world.

Remember, every one of us can be a hero. It''s not about superpowers or fancy shields – it''s about heart. It''s about standing up for what we believe in, even in the face of adversity. Let''s work together, united in our common goals, to create a future that reflects the best of what we stand for.

So, let''s roll up our sleeves and get to work. There''s much to be done, and together, we are strong. Together, we can continue to build a country and a world where freedom and justice are not just ideals, but realities for all.',
        8002),
       (1002, 'Guardian of the Night', default, 'This is Bruce Wayne, but in the shrouded veil of night, I am known as Batman. The streets of Gotham City harbor tales of shadows and secrets, and I am committed to upholding justice amidst these dark alleys. This city is my home, and protecting its people is my duty.

In Gotham, darkness is not just a symbol of fear; it''s a reality that lurks around every corner. But it''s in this darkness that I find my strength and resolve. As Batman, I stand as a guardian, a silent protector who confronts the chaos and corruption that threaten our streets.

The challenges we face in Gotham are not just from the villains and their schemes but also from the inner struggles that each of us battles. It''s about making the tough choices, standing firm against overwhelming odds, and fighting for a glimmer of hope in a city often clouded by despair.

My journey has taught me that true strength lies not in the might of one''s fist but in the resilience of the human spirit. It''s about being a beacon of hope in a world that often seems devoid of it. It''s about using our abilities, however great or small, to make a difference.

The night might be dark, and the path I walk is a solitary one, but as long as Gotham needs me, I will continue to be its shield against the night. Remember, it''s not just the mask or the cape that makes a hero. It''s the choices we make and the actions we take.

So to the people of Gotham, know this: you are not alone. In the darkest of times, look for the light, and if you cannot find it, be the light. Together, we can bring justice and peace to these streets.',
        8001),
       (1003, 'Innovation and Iron', default, 'Hey there, Tony Stark here, but you probably know me better as Iron Man. You see, in my world, it''s all about pushing the boundaries of what''s possible, blending the lines between technology and humanity. Stark Industries is at the forefront of that, and as its leader, I''m always looking for the next big leap forward.

Being Iron Man is more than just suiting up in advanced armor; it''s about taking responsibility for our actions, our inventions, and how they shape the world. Every circuit, every piece of tech in the Iron Man suit represents a decision I''ve made, a belief in a future where we use our intellect and resources for the greater good.

But, let''s be real - it''s not all smooth sailing. With great power comes... well, you know the rest. It''s not just about the glitz and glamour of being a superhero. It''s about facing the demons we create, both literally and metaphorically. It''s about standing up to the challenges, whether they come from rogue AI, intergalactic threats, or our own inner battles.

My journey has taught me a lot about humility, sacrifice, and what it truly means to be a hero. It''s not just the suit that makes me Iron Man; it''s the willingness to fight for what''s right, even if the odds are against you. It''s about using not only your mind but also your heart to solve problems and protect those you care about.

So, to all the aspiring inventors, dreamers, and heroes out there, remember this - the future is built on dreams and determination. Keep pushing the limits, keep striving for better, and never forget that sometimes, the most powerful weapon we have is our ability to change and adapt.

Iron Man out.', 8003);

create table if not exists comments
(
    commentId    int          not null primary key auto_increment,
    date         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content      varchar(255) not null,
    articleId    int          not null,
    commenter_id int          not null,
    foreign key (articleId) references articles (articleId),
    foreign key (commenter_id) references users (user_id)
);

insert into comments(commentId, date, content, articleId, commenter_id)
VALUES (2001, default, 'Why can''t you give a secret to a pig? Because it might squeal.', 1001, 8003),
       (2002, default, 'I have a joke about construction, but I''m still working on it.', 1002, 8003),
       (2003, default, 'I told my wife she should embrace her mistakes. She gave me a hug.', 1003, 8001),
       (2004, default, 'Why don''t scientists trust atoms? Because they make up everything.', 1002, 8002);


create table if not exists likes
(
    articleId int not null,
    user_id   int not null,
    primary key (articleId, user_id),
    foreign key (articleId) references articles (articleId),
    foreign key (user_id) references users (user_id)
);

insert into likes(articleId, user_id)
VALUES (1002, 8002),
       (1003, 8002),
       (1001, 8001),
       (1001, 8003);

UPDATE articles
SET likes = (SELECT COUNT(user_id)
             FROM likes
             WHERE articles.articleId = likes.articleId);

select user_id from users where userName='batman';
