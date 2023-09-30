const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');

const app = new Koa();
let tickets = [
  {
    id: 1,
    name: 'Поменять краску в принтере',
    description: 'Canon',
    status: false,
    created: 13823841,
  },
  {
    id: 2,
    name: 'Поменять краску в принтере',
    description: 'HP',
    status: false,
    created: 12313841,
  },
  {
    id: 3,
    name: 'Поменять краску в принтере',
    description: 'Dexp',
    status: true,
    created: 123413241,
  },
];

app.use(koaBody());
app.use(cors());

app.use((ctx, next) => {
  if (ctx.request.method !== 'GET') {
    next();

    return;
  }

  const { method, id } = ctx.request.query;
  switch (method) {
    case 'allTickets': {
      ctx.response.body = tickets;
      next();
      return;
    }
    case 'ticketById': {
      const body = tickets.filter((ticket) => ticket.id === Number(id));
      ctx.response.body = body;
      next();
      return;
    }
    default: {
      ctx.response.status = 404;
      next();
    }
  }
});

app.use((ctx, next) => {
  if (ctx.request.method !== 'DELETE') {
    next();

    return;
  }

  const { id } = ctx.request.query;
  tickets = tickets.filter((ticket) => ticket.id !== Number(id));

  ctx.body = tickets;

  next();
});

app.use((ctx, next) => {
  if (ctx.request.method !== 'POST') {
    next();

    return;
  }

  const body = JSON.parse(ctx.request.body);

  if (tickets.some((ticket) => ticket.name === body.name)) {
    ctx.status = 400;
    ctx.body = { message: 'Ticket was created!' };

    next();

    return;
  }

  if (tickets.length === 0) {
    body.id = 1;
    tickets.push(body);

    ctx.body = { message: 'Ticket was added!' };

    next();

    return;
  }
  const lastId = tickets[tickets.length - 1].id;
  body.id = lastId + 1;
  tickets.push(body);

  ctx.body = { message: 'Ticket was added!' };
  /* ctx.status = 204;
  Почему не возвращает тело, перекрывает его и пишет
  noContent в панели разработчика на фронте
  */
  next();
});

app.use((ctx, next) => {
  if (ctx.request.method !== 'PUT') {
    next();

    return;
  }

  const body = JSON.parse(ctx.request.body);

  tickets.map((ticket) => {
    if (ticket.id === body.id) {
      const index = tickets.indexOf(ticket);
      tickets[index] = body;
    }
    return tickets;
  });
  ctx.body = { message: 'Ticked was edited!' };

  next();
});

const server = http.createServer(app.callback());

const port = 7887;

server.listen(port, (err) => {
  if (err) {
    alert(err);
  }

  console.log(`Server listened to port: ${port}`);
});
