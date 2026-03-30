import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();


describe("Security - Rate limit", () => {

    it("suis je bloqué après 120 requetes", async () => {

        let blocked = false;

        for (let i = 0; i < 120; i++) {

            const response = await request(app)
                .post("/api/auth/login")
                .set("X-Forwarded-For", "1.2.3.4")
                .send({
                    email: "test_attack@gmail.com",
                    password: "1234567IIDESqez"
                });

            if (response.status === 429) {
                console.log('reponse page : ' + response.status)
                blocked = true;
                break;
            }

        }

        expect(blocked).toBe(true);

    });
});