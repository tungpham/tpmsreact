process.env.DEBUG = "swagger:*";
process.chdir(__dirname);

var swagger = require("swagger-server");
var app = swagger("api.yaml");
var faker = require("faker");
var express = require("express");
var path = require("path");
require('dotenv').config();

app.enable("case sensitive routing");
app.enable("strict routing");

const generateUser = email => ({
  id: faker.random.uuid(),
  avatar: faker.image.avatar(),
  name: faker.name.findName(),
  email: email ? email : faker.internet.email(),
  phone: faker.phone.phoneNumber()
});

const defaultUser = generateUser();

const generateNumber = number => ({
  id: faker.random.uuid(),
  number: number || faker.phone.phoneNumber(),
  name: faker.name.findName(),
  recording: false,
  notification: true,
  country: faker.address.countryCode().toLowerCase(),
  smsForwarding: {
    phone: true,
    email: false
  },
  owner: defaultUser.id,
  capabilities: {
    sms: true,
    mms: true,
    voice: true
  },
  avatar: faker.image.avatar()
});

const generateMessage = (from, to, message) => ({
  from: from.id,
  to: to.id,
  date: faker.date.recent(1),
  message: message || faker.lorem.lines(faker.random.number(3) + 1)
});

const generateMessages = (user1, user2) => {
  const g = () => {
    if (faker.random.boolean()) return generateMessage(user1, user2);
    else return generateMessage(user2, user1);
  };

  return [...Array(20).keys()].map(() => g());
};

const generateConversation = from => {
  const number = generateNumber();

  return {
    type: "conversation",
    id: number.id,
    from,
    to: number,
    numberOfUnread: faker.random.number(20),
    latestMessage: generateMessage(from, number)
  };
};

const generateVoice = from => {
  const number = generateNumber();

  return {
    type: "voice",
    id: number.id,
    from,
    to: number,
    latestCall: {
      type: faker.random.arrayElement(["incoming", "outgoing"]),
      date: faker.date.recent(1)
    }
  };
};

const generateChats = from => {
  const conversations = [...Array(faker.random.number(3) + 2).keys()].map(() =>
    generateConversation(from)
  );
  const voices = [...Array(faker.random.number(3) + 2).keys()].map(() =>
    generateVoice(from)
  );

  const chats = [...conversations, ...voices];

  const numbers = chats.map(x => x.to);

  return { numbers, response: chats };
};

const generateResource = (path, x, id) =>
  new swagger.Resource(path, `/${id || x.id}`, x);

const generateNumberResource = (n, internal = false) =>
  generateResource(
    "/api/numbers" + (internal ? "/internal" : ""),
    n || generateNumber()
  );

const generateUserResource = n =>
  generateResource("/api/users", n || generateUser());

app.dataStore.save(
  generateUserResource(defaultUser),
  generateNumberResource(),
  generateNumberResource(),
  generateNumberResource(),
  generateNumberResource()
);

app.post("/api/login", (req, res, next) => {
  res.json({
    token: faker.random.alphaNumeric(16),
    user: defaultUser
  });
});

app.post("/api/register", (req, res, next) => {
  res.json({
    token: faker.random.alphaNumeric(16),
    user: defaultUser
  });
});

app.get("/api/numbers", (req, res, next) => {
  app.dataStore.getCollection("/api/numbers", (err, resources) => {
    res.json(
      resources.map(x =>
        Object.assign(x.data, {
          numberOfUnread: faker.random.number(30)
        })
      )
    );
  });
});

app.get("/api/chats/:numberId", (req, res, next) => {
  app.dataStore.get(`/api/chats/${req.params.numberId}`, (err, resource) => {
    if (resource) {
      return res.json(resource.data);
    }

    app.dataStore.get(`/api/numbers/${req.params.numberId}`, (err, number) => {
      if (!number) {
        res.sendStatus(404);

        return;
      }

      const { numbers, response } = generateChats(number.data);

      app.dataStore.save(...numbers.map(x => generateNumberResource(x, true)));
      app.dataStore.save(
        generateResource("/api/chats", response, req.params.numberId)
      );

      res.json(response);
    });
  });
});

app.get("/api/chat/:fromId/:toId/conversation/messages", (req, res, next) => {
  const resourcePath = "/api/chats/conversation/messages";
  const { fromId, toId } = req.params;
  const id = `${fromId}-${toId}`;

  app.dataStore.get(resourcePath + `/${id}`, (err, resource) => {
    if (resource) {
      return res.json(resource.data);
    }

    app.dataStore.get(`/api/numbers/${fromId}`, (err, fromNumber) => {
      if (!fromNumber) {
        //res.sendStatus(404);

        res.json([]);

        return;
      }

      app.dataStore.get(`/api/numbers/internal/${toId}`, (err, toNumber) => {
        if (!toNumber) {
          res.json([]);

          return;
        }

        const data = generateMessages(fromNumber.data, toNumber.data).sort(
          (a, b) => (a.date > b.date ? 1 : -1)
        );

        app.dataStore.save(generateResource(resourcePath, data, id));

        res.json(data);
      });
    });
  });
});

app.post("/api/chat/:fromId/:toId/conversation", (req, res, next) => {
  const resourcePath = "/api/chats/";
  const { fromId, toId } = req.params;

  app.dataStore.get(`/api/numbers/${fromId}`, (err, number) => {
    if (!number) {
      res.sendStatus(404);

      return;
    }
    const num = generateNumber(toId);

    app.dataStore.save(generateNumberResource(num));

    app.dataStore.get(resourcePath + `/${fromId}`, (err, n) => {
      if (!n) return;

      n.merge([
        ...n.data,
        {
          type: "conversation",
          from: number.data,
          to: num,
          id: num.id,
          numberOfUnread: 0,
          latestMessage: generateMessage(number.data, num, req.body.message)
        }
      ]);

      app.dataStore.save(n);

      app.dataStore.save(
        generateResource(
          "/api/chats/conversation/messages",
          [generateMessage(number.data, num, req.body.message)],
          `${number.data.id}-${num.id}`
        )
      );
    });

    res.json(num);
  });
});

app.get("/api/statistics/:numberId", (req, res, next) => {
  const card = () => ({
    aggregates: [
      {
        name: "Income",
        value: faker.random.number(5000)
      },
      {
        name: "Income",
        value: faker.random.number(5000)
      },
      {
        name: "Income",
        value: faker.random.number(5000)
      }
    ],
    data: [
      {
        date: faker.date.recent(30),
        value: faker.random.number(20)
      },
      {
        date: faker.date.recent(30),
        value: faker.random.number(20)
      },
      {
        date: faker.date.recent(30),
        value: faker.random.number(20)
      },
      {
        date: faker.date.recent(30),
        value: faker.random.number(20)
      },
      {
        date: faker.date.recent(30),
        value: faker.random.number(20)
      },
      {
        date: faker.date.recent(30),
        value: faker.random.number(20)
      }
    ]
  });

  res.send({
    id: req.params.numberId,
    balance: faker.random.number(50),
    conversation: card(),
    voice: card()
  });
});

app.post("/api/search", (req, res, next) => {
  const r = [...Array(faker.random.number(6) + 1).keys()]
    .map(generateNumber)
    .map(x => {
      x.type = "Local";
      x.price = faker.random.number({ min: 0.1, max: 5, precision: 2 });

      return x;
    });

  res.send(r);
});

app.put("/api/user", (req, res, next) => {
  res.send(req.body);
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 3001, function() {
  console.log("Swagger is running yeah");
});
