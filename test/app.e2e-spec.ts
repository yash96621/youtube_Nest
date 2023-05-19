import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { userlogin } from 'src/auth/AuthDto';
import { authorize } from 'passport';
import { historyturn } from 'src/library/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    app.listen(3333);
    prisma = app.get(PrismaService);

    // await prisma.CleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('auth', () => {
    describe('login', () => {
      it('should run login', () => {
        const dto: userlogin = {
          systemSceretKey: 'hfd4D#R$@%SAdasdt45FWgt53',
          email: 'yashsavani704@gmail.com',
          picture: 'sdfmskdfmsdkofms',
          name: 'yash savani',
        };

        return pactum
          .spec()
          .post('http://localhost:3333/auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('authToken', 'authToken');
      });
    });

    describe('Refreshlogin', () => {
      it('should run refresh login', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/auth/Refreshlogin')
          .withHeaders({ Authorizatione: 'bearer $S{authToken}' })
          .inspect();
      });
    });
  });

  describe('video', () => {});

  describe('comment', () => {});

  describe('library', () => {
    describe('turnHistory', () => {
      it('set history on or off', () => {
        const dto: historyturn = {
          History_save: false,
        };

        return pactum
          .spec()
          .post('http://localhost:3333/library/turnHistory')
          .withHeaders({ Authorizatione: 'bearer $S{authToken}' })
          .withBody(dto)
          .inspect();
      });
    });
  });
});
