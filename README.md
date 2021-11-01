# Availability Calendar

## About availability Calendar

This project presented as a final project in Holberton is a reservation management system so that park companies can control the number of visitors who come to their parks on a daily basis.

## Install

    npm install

## Run the app

Run the pap with env variables DB (name of the data base), USER_DB (Database user), PASSWORD_DB, (User password for the database), HOST, by default the connection to mysql wil be on port 3306. and and this programm will be listen in port 3000.

    npm start

## Run the tests

    npm test

# API

## API status

Returns the "ok" status of the API

### Request

`GET /`

    curl --location --request GET 'http://localhost:3000/api/v1/'

### Response

    200 OK

## Get list of Parks

Obtains a list of objects in each park with their id, name, capacity, createdAt and updatedAt values

### Request

`GET /parks`

    curl --location --request GET 'http://localhost:3000/api/v1/parks'

### Response

    HTTP/1.1 200 OK
    Date: Sun, 31 Oct 2021 20:57:37 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 154

    [{"id": 1, "name": "foo","capacity": 2000,"description": "Lorem ipsum","createdAt":"2021-10-30T15:25:14.000Z","updatedAt": "2021-10-30T15:25:14.000Z"}...]

## Post new Park

To create a new park need send name and capacity, description can be optional

### Request

`POST /parks`

    curl --location --request POST 'http://localhost:3000/api/v1/parks' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "name": "FOO",
    "capacity": 5000
    }'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 126

    {"id": 8, "name": "FOO", "capacity": "5000", "updatedAt": "2021-11-01T21:04:50.129Z", "createdAt":  2021-11-01T21:04:50.129Z"}

## Put new Park

Update the name or capacity of a specific park

### Request

`PUT /parks`

    curl --location --request PUT 'http://localhost:3000/api/v1/parks' \
    --header 'Content-Type: application/json' \
    --data-raw '{"id": 1, "description": "Neque quisquam est qui dolorem"}'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 13

    {"done": true}

## POST Parks capacity by ParkId

Get a list of parks capacityes for a given park id

### Request

`POST /parkcapacity/byparkid`

    curl --location --request POST 'http://localhost:3000/api/v1/parkcapacity/byparkid' \
    --header 'Content-Type: application/json' \
    --data-raw '{"ParkId": 1}'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 155

    [{"date": "2021-10-31", "dayCapacity": 500, "name": "FOO", "ParkId": 1, "createdAt": "2021-10-31T02:49:11.000Z", "updatedAt": "2021-10-31T02:49:11.000Z"},]

## POST Parks Availability

Get a list wit the status of avaibility (true or false) of all parks for a given date and number of guests

### Request

`POST /parkcapacity/availability`

    curl --location --request POST 'http://localhost:3000/api/v1/parkcapacity/availability' \
    --header 'Content-Type: application/json' \
    --data-raw '{"numOfGuests": 60, "date": "2021-10-27"}'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 52

    [{"id": 1, "name": "FOO", "availability": true},...]

## POST New park capacity

Add a new park capacity for a given date and park id

### Request

`POST /parkcapacity`

    curl --location --request POST 'http://localhost:3000/api/v1/parkcapacity' \
    --header 'Content-Type: application/json' \
    --data-raw '{"ParkId": 1, "date": "2021-10-30", "dayCapacity": 4000}'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 140

    {"date": "2021-10-30", "dayCapacity": "4000", "ParkId": 1, "updatedAt": "2021-11-01T22:27:22.622Z", "createdAt": "2021-11-01T22:27:22.622Z"}

## PUT New park capacity

Update capacity for a given day and park id

### Request

`PUT /parkcapacity`

    curl --location --request PUT 'http://localhost:3000/api/v1/parkcapacity' \
    --header 'Content-Type: application/json' \
    --data-raw '{"ParkId": 1, "date": "2021-10-27", "parkCapacity": 3000}'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 14

    {"done": true}

## Post New Reservation

Add a new reservation and create a new user if it does not exists

### Request

`POST /reservation/`

    curl --location --request POST 'http://localhost:3000/api/v1/reservation' \
    --header 'Content-Type: application/json' \
    --data-raw '{"firstName": "bar", "lastName": "bar", "email": "bar@bar.com", "numOfGuests": 2, "date": "2021-10-21", "ParkId": 1}'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 38

    {"done": true,"confirmCode": "cU36AO"}

## Post Reservations by park and date

Get a list of reservation for a park in a given date

### Request

`POST /reservation/list`

    curl --location --request POST 'http://localhost:3000/api/v1/reservation/list' \
    --header 'Content-Type: application/json' \
    --data-raw '{"date": "2021-10-31", "ParkId": "1"}'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 103

    [{"confirmCode": "cU36AO", "numOfGuests": 2, "name": "bar foo", "email": "bar@bar.com"},...]

## Post Summary of reservation

Get a summary of par capacity for a given day

### Request

`POST /reservation/summary`

    curl --location --request POST 'http://localhost:3000/api/v1/reservation/summary' \
    --header 'Content-Type: application/json' \
    --data-raw '{"date": "2021-10-27", "ParkId": "1"}'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 01 Nov 2021 21:04:50 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json
    Content-Length: 68

    {"capacityDay": 4000, "ConfirmGuest": 34, "remainingCapacity": 3966}
