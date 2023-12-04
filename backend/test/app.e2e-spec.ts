import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { User } from '@prisma/client';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strips away properties from the body, which are not defined in the dto
      }),
    );
    app.enableCors();

    await app.init();

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/ (GET) Doesn't return anything", () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  let acces_token = undefined;
  let testUser: User = undefined;

  describe('Auth', () => {
    describe('Account injection', () => {
      it('Should inject a new account in db', async () => {
        const user = await prisma.user.create({
          data: {
            email: 'test-acc@auch.com',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$CwD1Hh6blCZPWfv7m2HSUQ$1H594T6BoYBrYXv7QpJwohjrTR7pEfce/bd/Tk3doEA',
          },
        });
        delete user.password;
        testUser = user;
        testUser.password = 'secret-password';
      });
    });
    describe('Signin', () => {
      it('Wrong password should fail', async () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: testUser.email,
            password: 'wrong-pswd',
          })
          .set('Accept', 'application/json')
          .then((response) => {
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.statusCode).toEqual(401);
            expect(response.body.access_token).toBeUndefined();
          });
      });
      it('Right credentials should signin', async () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: testUser.email,
            password: testUser.password,
          })
          .set('Accept', 'application/json')
          .then((response) => {
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.statusCode).toEqual(200);
            expect(response.body.access_token).toBeDefined();
            acces_token = response.body.access_token;
          });
      });
    });
  });

  describe('Posts', () => {
    describe('Posts injection', () => {
      it('Should connect to db and populate a few posts', async () => {
        const posts = [
          { title: 'Test post', body: 'Lorem ipsum', userId: testUser.id },
        ];

        const creationPromises = [];

        for (let i = 0; i < 10; i++) {
          const post = posts[0];
          post.title += ' #' + (i + 1);
          creationPromises.push(
            prisma.posts.create({
              data: post,
            }),
          );
        }
        await Promise.all(creationPromises);
      });
    });

    describe('/posts (GET)', () => {
      it('wrong auth_token', async () => {
        return request(app.getHttpServer())
          .get('/posts')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + 'asdadasdad')
          .then((response) => {
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.statusCode).toBe(401);
            expect(response.body).toBeDefined();
          });
      });

      it('good auth_token', async () => {
        return request(app.getHttpServer())
          .get('/posts')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + acces_token)
          .then((response) => {
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBeDefined();
            expect(response.body.length).toBe(10);
            expect(response.body[0].body).toBe('Lorem ipsum');
          });
      });
    });
    describe('/posts/user/:id (GET)', () => {
      it('wrong auth_token', async () => {
        return request(app.getHttpServer())
          .get('/posts/user/' + testUser.id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + 'asdadasdad')
          .then((response) => {
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.statusCode).toBe(401);
            expect(response.body).toBeDefined();
          });
      });

      it('good auth_token', async () => {
        return request(app.getHttpServer())
          .get('/posts/user/' + testUser.id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + acces_token)
          .then((response) => {
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBeDefined();
            expect(response.body.length).toBe(10);
            expect(response.body[0].body).toBe('Lorem ipsum');
          });
      });
    });
  });

  describe('Meteo', () => {
    describe('7 day forecast data', () => {});
  });
});
