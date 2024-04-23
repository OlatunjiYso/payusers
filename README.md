## Payever Backend Drills
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>

### Installation

```bash
$ npm install
```

###  Running the app

```bash
# development
$ npm run start
```

### Endpoints

1. POST /api/users <br>
Creates a new  After its creation, it sends an email to 'user.email' with a welcome message and also a RabbitMQ event.
<br/>
2. GET /api/user/{userId}  <br>
This route retrieves data from an external API and returns a user in JSON representation with dummy information.
<br/>
3. GET /api/user/{userId}/avatar  <br>
This route retrieves an image from the 'user.data' which is a URL at first. After the first request, it stores the image in the File System and generates a hash which is used to name the .jpg file and also the 'user.avatar' value. On following requests, the image is retrieved from the File System.
<br/>
4. DELETE /api/user/{userId}/avatar  <br>
This route removes the image file from the File System storage and also the 'user.avatar' entry in the database.

<br><br>

### Technologies
<ol>
<li> Nest JS </li>
<li> MongoDB </li>
<li> RabbitMQ </li>
</ol>