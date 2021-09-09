const Helper = require('./../helper');

const helper = new Helper();
// const baseUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${process.env.BASE_URL}`;
const baseUrl = `/${process.env.BASE_URL}`;

describe('Testing Quiz', () => {
  it('Inserts Quiz', async () => {
    const {body} = await helper.apiServer
      .post(`${baseUrl}/quiz/test/`, {
        body: {
          'title': 'test subgroup 5',
        },
      });

    console.log(body);
    expect(body).toHaveProperty('ok', true);

  });
});
