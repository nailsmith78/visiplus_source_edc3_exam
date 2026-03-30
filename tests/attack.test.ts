import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env';

let app = createApp();

describe("Security - Rate limit", () => {

    // Réinitialise l'app (et donc le middleware) avant chaque test
    beforeEach(() => {
        process.env.NODE_ENV = "test"; // Force l'environnement test
        app = createApp(); // Recrée l'app avec le middleware frais
    });

    it("devrait bloquer après 40 requêtes en environnement test", async () => {
        const maxRequests = env.NODE_ENV === "test" ? 40 : 100;
        let blocked = false;

        // Envoie maxRequests + 1 requêtes pour déclencher le blocage
        for (let i = 0; i < maxRequests + 1; i++) {
            const response = await request(app)
                .post("/api/auth/login")
                .set("X-Forwarded-For", "1.2.3.4")
                .send({
                    email: "test_attack@gmail.com",
                    password: "1234567IIDESqez",
                });

            if (response.status === 429) {
                blocked = true;
                break; // Sort dès qu'on est bloqué
            }


            await new Promise(resolve => setTimeout(resolve, 100));
        }

        expect(blocked).toBe(true); // Vérifie que le blocage a eu lieu
    });
});