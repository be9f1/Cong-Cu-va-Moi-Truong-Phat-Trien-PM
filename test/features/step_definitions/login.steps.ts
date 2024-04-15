import { Given, When, Then } from 'cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

let app: INestApplication;
let response: request.Response;

Given('I am on the login page', async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

When('I enter valid username and password', () => {
  response = request(app.getHttpServer())
    .post('/auth/login')
    .send({ username: 'validUsername', password: 'validPassword' });
});

When('I enter invalid username and password', () => {
  response = request(app.getHttpServer())
    .post('/auth/login')
    .send({ username: 'invalidUsername', password: 'invalidPassword' });
});

Then('I should be redirected to the dashboard', async () => {
  const data = await response;
  expect(data.status).toBe(200);
  expect(data.body).toHaveProperty('access_token');
});

Then('I should see an error message', async () => {
  const data = await response;
  expect(data.status).toBe(401);
});
