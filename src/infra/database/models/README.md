# Models used in Sinavia

Down below are the used models in Sinavia.

All the models are subject to change.

> **(?)** states that the attribute might or might not be in the model.

## User (In Progress)

These are the basic information about the User.

```
user_id: integer
username: text
name: text
surname: text
city: text
birth_date: date
favourite_questions: <text>array
profile_picture: text
cover_picture: text
total_sinavia_point: integer
badge_ids: <integer>array
user_level: json
(?)question_success_percentage: integer
```

**favourite_questions** array contains the question image links.

**badge_ids** array contains the **badge_id** attribute from the **Badge** model.

For the **user_level** attribute we use **json** object because there are many exams/courses/subjects.
Down below is an example of the object...

```
{
    lgs: {
        matematik: {
            dogal_sayilar: 5,
            uslu_sayilar: 9,
            ...
        },
        turkce: ...
    },
    yks: ...
}
```

`question_success_percentage` attribute is for the games that are played with bots. The bot's success rate changes with this attribute.

> We might add this attribute to the question itself. This means that every question will have a specific success rate.

## Question (TODO)

For every question there is a single row in the database table.

```
question_id: integer
exam_name: text
course_name: text
subject_name: text
download_link: text
correct_answer: integer
(?)success_percentage: integer
```

`success_percentage` attribute is the attribute disscused in the **User** model.

> As discussed above we might add this attribute to **Question** model.

## Notification (TODO)

```
user_id: integer
notification: json
notification_timestamp: date
```

Notifications are stored as **json** objects.

The general notification is more or less as follows..

```
{
    type: "some notification type"
    data: {
        title: "notification title"
        body: "notification body",
        additional data...
    }
}
```

## Badges (TODO)

These are the badges that users gain when they reach a certain milestone.

```
badge_id: integer
badge_name: text
badge_description: text
badge_picture: text
```

## Statistics (TODO)

```
user_id: integer
exam_name: text
course_name: text
subject_name: text
played_games: <json>array
```

We use **array** for the played games because finished games are stored as **json** objects.

For every game the users play, we will add the game info to this array to also show the user his/her past performances.

The content of this object is as follows...

```
correct_answers: integer
incorrect_answers: integer
unanswered_answers: integer
timestamp: date
```

## Active Games (TODO)

This model exist because other than synchronous games, there are also some asynchronous games when playing with a friend or with a group.

When a user initiates a game with his/her friend, the other user might not respond quickly enough to start a game synchronously.

When this happens the general game info is put in this table to show to the other user when he/she is available.

```
game_id(game_code): text
players: <integer>array
game_question: <text>array
(?)created_at: date
```

**game_id(game_code)** is an attribute made when user sends a game request to another user/users.

**players** array contains the user's **user_ids**

**game_questions** array contains the questions download links.

`created_at` attribute is for tracking the validness of the game. When an asynchronous game starts, it stays for 24 hours.

> We might make a different approach to this game mechanic.