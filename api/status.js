// Серверная функция Vercel: GET /api/status
// Выполняется на сервере, поэтому секрет API_KEY читается здесь и не попадает в код страницы.
// Наружу отдаётся только факт наличия ключа, а не его значение.
export default function handler(req, res) {
    try {
        res.status(200).json({
            apiKeyConfigured: Boolean(process.env.API_KEY),
            environment: process.env.VERCEL_ENV || "local",
            branch: process.env.VERCEL_GIT_COMMIT_REF || null,
            commit: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || null,
        });
    } catch (error) {
        console.error("Ошибка /api/status:", error.message);
        res.status(500).json({ error: "Ошибка сервера" });
    }
}
