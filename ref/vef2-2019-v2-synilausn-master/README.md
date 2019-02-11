# Verkefni 2

Sýnilausn á [verkefni 2](https://github.com/vefforritun/vef2-2019-v2) í vefforritun 2 árið 2019.

Búa þarf til postgresql gagnagrunn og setja tengistreng í skrá sem heitir `.env` (búa þarf þess skrá til). Sjá dæmi í `.env_example`. Sjá nánar í [`Að tengjast postgres`](https://github.com/vefforritun/vef2-2019/blob/master/itarefni/postgres.md).

Keyrt með:

```bash
npm install
npm run eslint
npm run setup
npm run dev
```

`npm run setup` hendir töflunni `applications`, býr hana til skv. `schema.sql` og setur inn gögn í `insert.sql`.
