
/* Écrire des tests avec Vitest et Supertest pour :
  * GET /api/columns
  * POST /api/columns
*/

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Column } from '../src/models/Column.js';

import {
  createTestUser,
  getAuthToken,
  createTestColumn,
} from './helpers.js';
import './setup.js';
import { Types } from 'mongoose';

const app = createApp();

describe('column', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    const user = await createTestUser(`test-${Date.now()}@example.com`);
    userId = user._id.toString();
    authToken = getAuthToken(user);

  });

  describe('GET /api/Columns', () => {
    it('Retourne un tableau vide si pas de colonne', async () => {
      const response = await request(app)
        .get('/api/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Columns retrieved successfully');
      expect(response.body.data).toEqual([]);
    });

    it('Retourne un body avec un data des colonnes présentes', async () => {
      // création de colonne
      const column1 = await createTestColumn(`Test Column ${Date.now()}`, 0);
      const column2 = await createTestColumn(`Test Column ${Date.now()}`, 1);

      const response = await request(app)
        .get('/api/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      /*  console.log('reponse data : ', response.body.data);
  
        console.log('reponse message : ', response.body.message);
  */
      expect(response.body).toHaveProperty('message', 'Columns retrieved successfully');
      expect(response.body.data).toHaveLength(2);

      // Vérifie la structure globale de la réponse
      expect(response.body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          data: expect.any(Array),
        })
      );

      // Vérifie la structure de chaque colonne
      response.body.data.forEach((column: any) => {
        expect(column).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            position: expect.any(Number),
          })
        );
      });
    });


  });


  /**
   * POST /api/columns - Create a new column
   */
  //  router.post('/', validate(createColumnSchema, 'body'), createColumn);
  describe('POST /api/columns', () => {
    const nameCol = `Test Column ${Date.now()}`;
    it('creation de colonne', async () => {
      const response = await request(app)
        .post('/api/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          "name": nameCol,
        })
        .expect(201);
      /*  console.log('reponse.body.data : ', response.body.data)*/
      expect(response.body).toHaveProperty('message', 'Column created successfully');
      expect(response.body.data).toHaveProperty('name', nameCol);


      // Vérifie que la colonne a bien été insérée en base
      const columnsAfter = await Column.findById(response.body.data._id);
      expect(columnsAfter?.name).toBe(nameCol);
      expect(columnsAfter?.position).toBe(response.body.data.position);
      expect(columnsAfter?._id.toString()).toEqual(response.body.data._id);
    });

    it('test si manque le name en insert', async () => {
      const response = await request(app)
        .post('/api/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
      /*console.log('erreur creation ', response.body, ' fin de message')*/
      expect(response.body.error).toBe('Validation error');
    });
  });

});

